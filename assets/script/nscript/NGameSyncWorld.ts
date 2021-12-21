import { newNextId, newReededRandom } from "../../ngame/util/util-ngame";
import { JGet } from "../axios";
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
import {uWait} from '../../ngame/util/util-func'

const {ccclass, property} = cc._decorator;


/**
 * 处理帧同步的核心类
 */
@ccclass
export default class NGameSyncWorld extends cc.Component {

    @property({displayName:'同步时间 (和服务器保持一致)',type:cc.Integer})
    nSyncTime:number = 1000/10;

    @property({displayName:'大于多少帧进行追帧',type:cc.Integer})
    nMaxFrameBan:number = 6;

    //分帧数
    @property({displayName:'将服务器帧数进行平分',type:cc.Integer})
    nDivideFrame:number = 3;

    //帧队列
    nFrameQueue:NFrameInfo[] = [];

    //未列入的帧 (帧(index),帧数据)
    nNoFrame:Map<number,NFrameInfo[]> = new Map();

    //本地同步帧
    nLocalFrame:number = -1;

    //需要同步的Actor
    nSyncActors:NGameSyncComponent<NSyncInput>[] = [];

    //初始化随机
    randSyncNumber:Function = newReededRandom(200);

    //初始化NextId
    nextSyncNumber:Function = newNextId(1000);

    //是否正在获取服务器帧
    isGetServerFrame:boolean = false;
    

    // //缓存帧
    // nFrameCacheQueue:NFrameInfo[] = [];

    onLoad(){

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
        let frames:NFrameInfo[] = [...Array(this.nDivideFrame)].map((item,index) => {
            return index === 0 ? frame : new NFrameInfo();
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

    /**
     * 消费帧
     */
    async nUseFrame(){

        let dt:number = this.nSyncTime / this.nDivideFrame;

        let loop:number = dt;

        //取出帧
        let frame:NFrameInfo = this.nFrameQueue.shift();

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
            cc.game.pause();
            const physics:any = cc.director.getPhysicsManager();
            physics.enabled = true;
            physics.FIXED_TIME_STEP = dt / 1000;
            physics.update(dt / 1000);
            physics.enabled = false;
            cc.game.resume();

            //大于nMaxFrameBan 进行 追帧
            if(this.nFrameQueue.length > this.nMaxFrameBan) {
                //适当追快点
                if(frame.i != null) 
                    loop = 0;
                else
                    loop = -1;
            }else if(this.nFrameQueue.length > 0) { //正常继续执行
                loop = dt;
            }

        }else{
            //延迟 循环
            loop = dt;
        }

        //如果需要延迟则延迟
        if(loop !== -1){
            await uWait(loop);
        }

        this.nUseFrame().then();

    }




}
