import NGameSyncComponent from "../ncomponent/NGameSyncComponent";
import { CNCocosFrameAction } from "../ncontroller/client/CNCocosFrameAction";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NFrameInfo } from "../nenity/NFrameInfo";

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
    nSyncActors:NGameSyncComponent[] = [];

    // //缓存帧
    // nFrameCacheQueue:NFrameInfo[] = [];

    onLoad(){

        CNCocosFrameAction.nSyncWorld = this;

    }

    /**
     * 添加帧数据
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

        //执行逻辑帧
        this.nSyncActors.forEach(actor => actor.nUpdate(this.nSyncTime))
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
