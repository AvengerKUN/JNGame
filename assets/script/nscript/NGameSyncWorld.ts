import NGameSyncComponent from "../ncomponent/NGameSyncComponent";
import { CNCocosFrameAction } from "../ncontroller/client/CNCocosFrameAction";
import SNCocosFrameAction from "../ncontroller/service/SNCocosFrameAction";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NFrameInfo, NInputMessage, NSyncInput } from "../nenity/NFrameInfo";

const {ccclass, property} = cc._decorator;


/**
 * 处理帧同步的核心类
 */
@ccclass
export default class NGameSyncWorld extends cc.Component {

    @property({displayName:'同步时间 (和服务器保持一致)',type:cc.Integer})
    nSyncTime:Number = 1000/10;

    @property({displayName:'大于多少帧进行追帧',type:cc.Integer})
    nMaxFrameBan:Number = 5;

    //帧队列
    nFrameQueue:NFrameInfo[] = [];
    //本地同步帧
    nLocalFrame:Number = 0;

    //需要同步的Actor
    nSyncActors:NGameSyncComponent<NSyncInput>[] = [];

    // //缓存帧
    // nFrameCacheQueue:NFrameInfo[] = [];

    onLoad(){

        CNCocosFrameAction.nSyncWorld = this;
        
        //开始同步操作
        this.nStartSyncInput();

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
        console.log(frame);
        this.nFrameQueue.push(frame)
        this.useFrame();
    }

    /**
     * 消费帧
     */
    useFrame(){

        //取出帧
        let frame:NFrameInfo = this.nFrameQueue.shift();
        this.nLocalFrame = frame.i;

        //循环处理帧数据
        this.nSyncActors.forEach(actor => {
            //初始默认输入
            let input:NSyncInput = actor.initInput();

            //找到帧数据中的actor输入
            frame.ds.forEach(frame => {
                if(frame.nId === actor.nId) input = frame.input;
            });
            
            //更新
            actor.nUpdate(this.nSyncTime,input);
        })
        //执行物理帧
        const physics:any = cc.director.getPhysicsManager();
        physics.enabled = true;
        physics.update(this.nSyncTime);
        physics.FIXED_TIME_STEP = this.nSyncTime;
        physics.enabled = false;

        //大于nMaxFrameBan 进行 追帧
        if(this.nFrameQueue.length > this.nMaxFrameBan) this.useFrame();

    }




}
