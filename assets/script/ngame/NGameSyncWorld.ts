import { newNextId, newReededRandom } from "../../ngame/util/util-ngame";
import { JGet } from "../axios";
import NGameSyncComponent from "./NGameSyncComponent";
import { CNCocosFrameAction } from "./ncontroller/client/CNCocosFrameAction";
import SNCocosFrameAction from "./ncontroller/service/SNCocosFrameAction";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NFrameInfo, NInputMessage, NSyncInput } from "./NFrameEnity";
import {uWait} from '../../ngame/util/util-func'
import { _decorator, Component, Enum, CCInteger, game, PhysicsSystem2D, PhysicsSystem } from 'cc';

const {ccclass, property} = _decorator;


/**
 * 处理帧同步的核心类
 */
@ccclass
export default class NGameSyncWorld extends Component {

    @property({displayName:'同步时间 (和服务器保持一致)',type:CCInteger})
    nSyncTime:number = 1000/10;


    @property({displayName:'大于多少帧进行追帧',type:CCInteger})
    nMaxFrameBan:number = 3;
    @property({displayName:'大于多少帧进行循环追帧',type:CCInteger})
    nMaxFrameLoopBan:number = 6;

    //分帧数
    @property({displayName:'将服务器帧数进行平分',type:CCInteger})
    nDivideFrame:number = 3;

    //帧队列
    nFrameQueue:NFrameInfo[] = [];

    //预测操作
    nForecastFrameQueue:{key:number,info:NFrameInfo}[] = [];
    //预测index
    nForecastFrameIndex:number = -1;

    //未列入的帧 (帧(index),帧数据)
    nNoFrame:Map<number,NFrameInfo> = new Map();

    //本地同步帧
    nLocalFrame:number = -1;

    //需要同步的Actor
    nSyncActors:NGameSyncComponent<NSyncInput>[] = [];

    //初始化随机
    randSyncNumber:Function = newReededRandom(200);

    //初始化NextId
    nextSyncNumber:Function = newNextId(9999);

    //是否正在获取服务器帧
    isGetServerFrame:boolean = false;

    //本地运行的帧
    localFrameNumber:number = 0;

    //是否开启预测
    isForecast:boolean = false;

    // //缓存帧
    // nFrameCacheQueue:NFrameInfo[] = [];

    onLoad(){

        //关闭物理帧
        PhysicsSystem2D && (PhysicsSystem2D.instance.autoSimulation = false);
        PhysicsSystem && (PhysicsSystem.instance.autoSimulation = false);

        CNCocosFrameAction.nSyncWorld = this;
        
        //开始同步操作
        this.nStartSyncInput();

        //激活消费帧
        this.nUseFrame().then();
        
    }

    //开始同步操作
    nStartSyncInput(){
        //定时发送操作
        setInterval(this.nUpdateInput.bind(this),this.nSyncTime.valueOf());
    }

    //提交输入
    nUpdateInput(){

        //帧数据
        let inputs:Array<NInputMessage> = new Array();

        //定时发送输入给服务器
        this.nSyncActors.forEach(nGameSync => {

            let actor:NInputMessage = new NInputMessage();

            actor.nId = nGameSync.nId;
            actor.input = nGameSync.input;

            //将输入初始
            nGameSync.input = null;

            //整理输入数据
            if(actor.input) inputs.push(actor);

        });
        inputs = inputs.filter(item => item);

        //向服务器发送帧输入
        if(inputs.length) SNCocosFrameAction.nGameFrameInput(inputs);
    }

    /**
     * 接收帧数据
     * @param frame 帧数据
     */
    addFrame(frame:NFrameInfo){


        //我需要的下一帧
        let nextIndex:number = this.nLocalFrame + 1;

        //判断接受的帧是否下一帧 如果不是则加入未列入
        if(frame.i !== nextIndex){
            this.nNoFrame[frame.i] = frame;

            //在未列入中拿到需要的帧
            let noFrame = null;
            if(!(noFrame = this.nNoFrame[nextIndex])){
                //如果未列中没有则 并且要的帧数低于服务器帧数 向服务器请求
                if(!this.isGetServerFrame && nextIndex < frame.i) this.vGetServerFrame(this.nLocalFrame);
                return;
            }else{
                //转正
                frame = noFrame;
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
        this.nNoFrame[nextIndex + 1] && this.addFrame(this.nNoFrame[nextIndex + 1])
    }

    /**
     * 向服务器获取之前的帧
     */
    async vGetServerFrame(start = null,end = null){

        this.isGetServerFrame = true;

        //向服务器获取帧
        let frames:[] = (await JGet("/open/cocos-frame",{start,end})).data;
        if(frames){
            //将获取到的帧添加进去
            frames.forEach(frame => {
                this.addFrame(frame);
            })
        }

        this.isGetServerFrame = false;
        
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


    /**
     * 消费帧
     * @returns 
     */
    async nUseFrame(){


        let dt:number = this.nSyncTime / this.nDivideFrame;

        let loop:number = dt;

        let frame:NFrameInfo = null; //帧数据
        let isForecast:boolean = false; //是否预测
        //取出 (在帧队列 或者 预测队列中 取出)
        if(!(frame = this.nFrameQueue.shift())){
            
            if(this.isForecast){
                //如果取出没有则给预测帧
                frame = new NFrameInfo();
                this.nForecastFrameIndex++;
                this.nForecastFrameQueue.push({key:this.nForecastFrameIndex,info:frame});
                isForecast = true;
    
                //循环处理预测更新
                this.nSyncActors.forEach(actor => {
                    //预测更新
                    actor.nForecastUpdate(this.nForecastFrameIndex);
                })
            }

        }else{
            //在帧队列取出 如果 之前有预测则判断之前预测的对不对
            let fFrame:{key:number,info:NFrameInfo} = null;
            if((fFrame = this.nForecastFrameQueue.shift())){
                // console.log(frame,fFrame);
                // console.log("this.nForecastFrameQueue",this.nForecastFrameQueue.length);
                //判断之前预测的对不对 如果不对则回滚 (这里虚假判断)
                if(frame.getDs().length !== fFrame.info.getDs().length){
                    // //(暂停cocos 以防影响回滚)
                    game.pause();
                    //将nSyncActors回滚 信息
                    this.nSyncActors.forEach(actor => {
                        actor.nForecastRollBack(fFrame.key,frame);
                    });
                    //回滚之后将预测队列初始化
                    this.nForecastFrameQueue = [];
                    //继续执行正确的帧
                    //强行更新游戏帧 保证 回滚完成
                    game.step();
                    game.resume();
                }else{
                    //如果预测成功则不执行当前帧 并且继续验证 下一帧
                    frame = null;
                    //适当追快点
                    loop = 0;
                }
            }
        }

        if(frame) {

            //循环调用通知结束上一帧
            this.nSyncActors.forEach(actor => {
                if(actor.inputExecute)
                    actor.nFrameStep(actor.inputExecute);
            });

            //循环处理帧数据
            this.nSyncActors.forEach(actor => {

                //找到帧数据中的actor输入
                (frame.ds || []).forEach(frame => {
                    if(frame.nId === actor.nId) {
                        //将帧操作添加到指定控制的Actor中
                        actor.unInputSyncs.push(frame.input);
                    }
                });
                
                //更新 并且在未处理输入中取出操作 如果没有则初始化一个操作
                actor.nUpdate(
                    dt,actor.vNextInputSync(),this.nSyncTime //获取下一帧操作
                );
            })

            //执行物理帧(暂停cocos 以防多次运行物理帧)
            game.pause();

            this.nNextPhysics(frame);
            // const physics:any = director.getPhysicsManager();
            // physics.enabled = true;
            // physics.FIXED_TIME_STEP = dt / 1000;
            // physics.update(dt / 1000);
            // physics.enabled = false;

            game.resume();

            //大于nMaxFrameBan 进行 追帧
            if(this.nFrameQueue.length > this.nMaxFrameBan) {
                    
                //计算超过的帧数
                let exceed = this.nFrameQueue.length - this.nMaxFrameBan;
                let most = this.nMaxFrameLoopBan - this.nMaxFrameBan;
                
                //自适应追帧算法
                if(exceed <= this.nMaxFrameLoopBan){
                    let ldt = ((most - exceed) / most) * dt;
                    loop = ldt;
                }else{
                    if(frame.i){
                        loop = 0;
                    }else{
                        loop = -1;
                    }
                }

            }else{
                loop = dt;
            }

        }

        //如果需要延迟则延迟
        if(loop !== -1){
            await uWait(loop);
        }

        this.nUseFrame().then();

    }




}
