
import { _decorator, Component, Enum, Game, game, PhysicsSystem2D, PhysicsSystem, CCInteger, director } from 'cc';
import NGameApplication, { NClientType } from '../../ngame/network/NGameApplication';
import { NSyncInput } from '../nenity/NFrameInfo';
import NGameSyncComponent, { NStateSync } from './NGameSyncComponent';

const {ccclass, property} = _decorator;

/**
 * 处理状态同步的核心类
 */
@ccclass
export default class NGameStateWorld extends Component {

    //当前连接的服务器
    nServerId:String = '1642554330845';

    //是否是服务端
    isServer:boolean = (NGameApplication.ntype == NClientType.SERVER);

    //所有同步类
    private nSyncActors:NGameSyncComponent<NSyncInput,NStateSync>[] = [];

    //设置帧数
    nSyncTime:number = 1000/10;

    @property({displayName:'帧数进行平分',type:CCInteger})
    nDivideFrame:number = 3;

    
    onLoad(){
        if(this.isServer){
            this.initServer();
        }else{
            this.initClient();
        }
    }

    //初始化服务器逻辑
    initServer(){
        //为了性能 物理帧 和 视图帧都以同步帧(nSyncTime)为准
        this.nDivideFrame = 1;

        //关闭视图帧 和 物理帧
        game.pause();
        PhysicsSystem2D && (PhysicsSystem2D.instance.autoSimulation = false);
        PhysicsSystem && (PhysicsSystem.instance.autoSimulation = false);

        //开始运行主程序
        setInterval(this.nRunMainServer.bind(this),this.nSyncTime / this.nDivideFrame);

    }

    //初始化客户端逻辑
    initClient(){

        //为了性能 物理帧 和 视图帧都以同步帧(nSyncTime)为准
        this.nDivideFrame = 3;

        //关闭物理帧
        PhysicsSystem2D && (PhysicsSystem2D.instance.autoSimulation = false);
        PhysicsSystem && (PhysicsSystem.instance.autoSimulation = false);

        //开始运行主程序
        setInterval(this.nRunMainClient.bind(this),this.nSyncTime / this.nDivideFrame);

    }

    //运行Server主程序
    nRunMainServer(){
        game.step();
        this.nNextPhysics();
    }

    //运行Client主程序
    nRunMainClient(){
        this.nNextPhysics();
    }

    //下一帧物理
    nNextPhysics(){

        //执行物理帧(暂停cocos 以防多次运行物理帧)
        game.pause();

        let dt:number = this.nSyncTime / this.nDivideFrame;

        let physics2d = PhysicsSystem2D?.instance;
        let physics3d = PhysicsSystem?.instance;

        physics2d && (physics2d.fixedTimeStep = dt / 1000);
        physics3d && (physics3d.fixedTimeStep = dt / 1000);
        physics2d && (physics2d.autoSimulation = true);
        physics3d && (physics3d.autoSimulation = true);
        physics2d && (physics2d.postUpdate(dt));
        physics3d && (physics3d.postUpdate(dt));
        physics2d && (physics2d.autoSimulation = false);
        physics3d && (physics3d.autoSimulation = false);

        game.resume();
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
            this.nSyncActors.push(actor);
        }else{
            //如果不能添加则删除
            // actor.node.destroy();
        }
    }

}