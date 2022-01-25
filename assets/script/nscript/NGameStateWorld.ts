
import { _decorator, Component, Enum, Game, game, PhysicsSystem2D, PhysicsSystem, CCInteger, director, Prefab, Node, instantiate, PrimitiveType, Director } from 'cc';
import NGameApplication, { NClientType } from '../../ngame/network/NGameApplication';
import { uWait } from '../../ngame/util/util-func';
import { newNextId } from '../../ngame/util/util-ngame';
import { NFrameInfo, NInputMessage, NStateInfo, NStateMessage, NStateSync, NSyncInput } from '../nenity/NFrameInfo';
import { CNCocosBridgeAction } from './ncontroller/client/CNCocosBridgeAction';
import SNCocosBridgeAction from './ncontroller/service/SNCocosBridgeAction';
import NGameComponent from './NGameComponent';
import NGameSyncComponent from './NGameSyncComponent';

const {ccclass, property} = _decorator;

/**
 * 处理状态同步的核心类
 */
@ccclass
export default class NGameStateWorld extends Component {

    //当前连接的服务器
    nServerId:string = '1642582201434';

    //是否是服务端
    isServer:boolean = (NGameApplication.ntype == NClientType.SERVER);

    //所有同步类
    private nSyncActors:Map<number,NGameSyncComponent<NSyncInput,NStateSync>> = new Map();

    //所有组件类
    private nComponents:Map<number,NGameComponent<NSyncInput>> = new Map();

    //设置帧数
    nSyncTime:number = 1000/15;

    //本地同步帧
    nLocalFrame:number = 0;

    @property({displayName:'大于多少帧进行追帧',type:CCInteger})
    nMaxFrameBan:number = 3;
    @property({displayName:'大于多少帧进行循环追帧',type:CCInteger})
    nMaxFrameLoopBan:number = 6;

    // @property({displayName:'帧数进行平分',type:CCInteger})
    nDivideFrame:number = 4;

    @property({displayName:'同步 Prefab 列表',type:[Prefab]})
    nSyncPrefabs:Prefab[] = [];

    @property({displayName:'同步的 世界',type:Node})
    nSyncWorld:Node;

    //当前帧操作(Server)
    nFameInfo:NFrameInfo = new NFrameInfo();

    //帧队列
    nFrameQueue:NFrameInfo[] = [];

    //未列入的帧 (帧(index),帧数据)
    nNoFrame:Map<number,NFrameInfo> = new Map();
    
    //初始化NextId
    nextSyncNumber:Function = newNextId(1000);


    onLoad(){

        CNCocosBridgeAction.nSyncWorld = this;

        if(this.isServer){
            this.initServer();
        }else{
            this.initClient();
            //加入服务器
            SNCocosBridgeAction.nJoinServer(this.nServerId);
        }
    }

    //初始化服务器逻辑
    initServer(){
        // //为了性能 物理帧 和 视图帧都以同步帧(nSyncTime)为准
        // this.nDivideFrame = 1;

        //关闭视图帧 和 物理帧
        game.pause();
        PhysicsSystem2D && (PhysicsSystem2D.instance.autoSimulation = false);
        PhysicsSystem && (PhysicsSystem.instance.autoSimulation = false);

        //开始运行主程序
        setInterval(this.nRunMainServer.bind(this), this.nSyncTime);

    }

    //初始化客户端逻辑
    initClient(){

        //关闭物理帧
        PhysicsSystem2D && (PhysicsSystem2D.instance.autoSimulation = false);
        PhysicsSystem && (PhysicsSystem.instance.autoSimulation = false);

        //开始运行主程序
        // setInterval(this.nRunMainClient.bind(this),this.nSyncTime / this.nDivideFrame);
        this.nRunMainClient().then();
        //初始定时发送操作
        setInterval(this.nRunSubmitInput.bind(this), this.nSyncTime)

    }

    //客户端处理帧数据
    nHandleFrame(frame:NFrameInfo){

        //我需要的下一帧
        let nextIndex:number = this.nLocalFrame + 1;

        //判断接受的帧是否下一帧 如果不是则加入未列入
        if(frame.i !== nextIndex){
            this.nNoFrame[frame.i] = frame;

            //在未列入中拿到需要的帧
            let noFrame = null;
            if((noFrame = this.nNoFrame[nextIndex])){
                //如果有则转正
                frame = noFrame;
            }else{
                //如果没有则返回 return;
            }
        }

        //删除未列入
        this.nNoFrame.delete(frame.i);

        this.nLocalFrame = frame.i;

        //将服务器帧数进行平分
        let frames:NFrameInfo[] = Array.from((new Array(this.nDivideFrame)).keys()).map((item,index) => {
            return index === 0 ? Object.assign(new NFrameInfo(),frame) : new NFrameInfo();
        })
        this.nFrameQueue = this.nFrameQueue.concat(frames)

        //判断未列入中是否有下一帧如果有则再次执行
        this.nNoFrame[nextIndex + 1] && this.nHandleFrame(this.nNoFrame[nextIndex + 1])
    }

    //添加状态列表数据(重置状态)
    nHandleStates(states:NStateInfo){

        //重置帧数据
        this.nFrameQueue = [];

        let key:number = null;
        //删除之前未加入的帧数据
        while (key = this.nNoFrame.keys().next().value) {
            if(key <= states.i){
                this.nNoFrame.delete(key);
            }
        }

        //设置当前帧数
        this.nLocalFrame = states.i;

        //更新场景的状态
        states.ds.forEach(state => {
            this.nHandleState(state)
        });

    }

    //更新状态
    nHandleState(state:NStateMessage){

        //找到 同步 Actor
        let nSyncNode:Node = null;
        let nSyncActor:NGameSyncComponent<NSyncInput,NStateSync> = this.nSyncActors.get(state.nId);

        //如果没有找则生成
        if(!nSyncActor){

            let prefab:Prefab = null;
            if(!(prefab = this.nSyncPrefabs[state.prefab])) return;

            nSyncNode = instantiate(prefab);

            let components = nSyncNode.components;
            
            for (let index in components) {
                let element = components[index];
                if(element instanceof NGameSyncComponent)
                    nSyncActor = element;
            }

            nSyncActor.nId = state.nId;
            nSyncActor.nGameSyncWorld = this;
            nSyncActor.isActorServer = true;

            //找到Node 的 父节点
            let cParentNode:Node = this.nSyncWorld.getChildByPath(state.path);

            //找到则添加到场景中
            if(!cParentNode) return;
            nSyncNode.parent = cParentNode;

        }

        nSyncNode = nSyncActor.node;
        nSyncActor.nSyncState(state.state);

    }

    //添加帧数据(帧数据)
    nHandleInput(frames:NInputMessage[]){

        //将用户的操作添加到列表中
        this.nFameInfo.ds = this.nFameInfo.getDs().concat(frames);

    }

    //提交操作(将客户端的操作提交到服务器)
    nRunSubmitInput(){

        //帧数据
        let inputs:Array<NInputMessage> = new Array();

        //定时发送输入给服务器
        for (const nGameSync of [...Array.from(this.nSyncActors.values()),...Array.from(this.nComponents.values())]) {
            let actor:NInputMessage = new NInputMessage();
            actor.nId = nGameSync.nId;
            actor.input = nGameSync.input;

            //将输入初始
            nGameSync.input = null;

            //整理输入数据
            if(actor.input) inputs.push(actor);
        }

        inputs = inputs.filter(item => item);

        inputs.length && SNCocosBridgeAction.vCSendInput(inputs);


    }

    //运行Server主程序
    nRunMainServer(){

        let dt:number = this.nSyncTime / this.nDivideFrame;
        
        //向所有客户端提交 帧数据消息
        this.nFameInfo.i = this.nLocalFrame++;

        //执行物理层
        (Array.from(new Array(this.nDivideFrame).keys())).forEach((value,index) => {

            if(index === 0){
                //执行下一帧逻辑
                this.nNextLogic(this.nFameInfo);
                this.nNextPhysics(this.nFameInfo);
            }else{
                //执行下一帧逻辑
                this.nNextLogic(new NFrameInfo());
                this.nNextPhysics(new NFrameInfo());
            }
        })
        
        //执行视图层
        game.step();
        game.pause();

        // console.log(this.nFameInfo);

        //发送帧数据给所有客户端
        SNCocosBridgeAction.vSSendFrame(this.nFameInfo);
        
        //初始化帧数据
        this.nFameInfo = new NFrameInfo();

    }

    //获取当前Server 所有 同步的状态
    nGetStateInfo():NStateInfo{
        
        //创建 状态 消息
        let nStateInfo = new NStateInfo();
        nStateInfo.i = this.nLocalFrame;

        //获取所有Actor 状态 然后传播出去
        let states = Array.from(this.nSyncActors.values()).map(actor => {

            let message = new NStateMessage();
            message.nId = actor.nId;
            message.prefab = actor.nPrefabIndex;
            message.path = actor.nWorldPath;
            message.state = actor.vGetStateSync();
            // message.input = actor.vGetInputSync();
            return message;

        });

        nStateInfo.ds = states;

        return nStateInfo;

    }

    //运行Client主程序
    async nRunMainClient(){

        let dt:number = this.nSyncTime / this.nDivideFrame;
        let loop:number = dt;
        
        //是否执行
        let isRun:boolean = true;

        let frame:NFrameInfo = this.nFrameQueue.shift(); //取出帧数据
        if(!frame) {
            isRun = false;
        };

        if(isRun){
            //执行逻辑
            this.nNextLogic(frame);
            //执行物理
            this.nNextPhysics(frame);
            
            //大于nMaxFrameBan 进行 追帧
            if(this.nFrameQueue.length > this.nMaxFrameBan) {
                
                //计算超过的帧数
                let exceed = this.nFrameQueue.length - this.nMaxFrameBan;
                let most = this.nMaxFrameLoopBan - this.nMaxFrameBan;
                
                //自适应追帧算法
                let ldt = ((most - exceed) / most) * dt;
                loop = ldt;
                
            }else{
                loop = dt;
            }

        }

        //如果需要延迟则延迟
        if(loop !== -1){
            await uWait(loop);
        }

        this.nRunMainClient().then();

    }

    //执行下一帧逻辑
    nNextLogic(frame:NFrameInfo){

        let dt:number = this.nSyncTime / this.nDivideFrame;

        [...Array.from(this.nSyncActors.values()),...Array.from(this.nComponents.values())].forEach(nGameSync => {

            let input:NSyncInput = nGameSync.initInput();

            let ds = frame.ds;
            for (const index in ds) {
                const element = ds[index];
                if(element.nId === nGameSync.nId){
                    input = element.input;
                    break;
                }
            }

            nGameSync.nUpdate(
                dt,input,this.nSyncTime
            )

        });
    }

    //下一帧物理
    nNextPhysics(frame:NFrameInfo){
        
        //执行物理帧(暂停cocos 以防多次运行物理帧)
        game.pause();

        let dt:number = this.nSyncTime / this.nDivideFrame;

        let physics2d = PhysicsSystem2D?.instance;
        this.stepPhysicsWorld(physics2d,dt/1000);
        game.resume();
    }

    //推进物理
    stepPhysicsWorld(physics2d:PhysicsSystem2D,deltaTime: number){
        const velocityIterations = physics2d.velocityIterations;
        const positionIterations = physics2d.positionIterations;

        physics2d.physicsWorld.step(deltaTime, velocityIterations, positionIterations);
        physics2d.physicsWorld.syncPhysicsToScene();

        if (physics2d.debugDrawFlags) {
            physics2d.physicsWorld.drawDebug();
        }
    }

    //添加同步对象
    nAddSyncActor(actor:NGameSyncComponent<NSyncInput,NStateSync>){

        let isAdd = false;
        if(this.isServer){
            //如果是服务器则只能添加不是服务器的Actor
            isAdd = actor.isActorServer == false;
        }else{
            //如果是客户端则只能添加是服务器的Actor
            isAdd = actor.isActorServer == true;
        }
        //添加Actor
        if(isAdd){
            //如果是服务器则生成nId
            if(this.isServer && actor.nId === null){
                actor.nId = this.nextSyncNumber();
            }
            this.nSyncActors.set(actor.nId,actor);
        }else{
            // 如果不能添加则删除
            actor.node.destroy();
        }

    }

    //添加同步组件
    nAddComponent(component:NGameComponent<NSyncInput>){

        if(component.nId){
            
            this.nComponents.set(component.nId,component);

        }else{
            // 如果没有NID则删除
            component.node.destroy();
        }

    }

}