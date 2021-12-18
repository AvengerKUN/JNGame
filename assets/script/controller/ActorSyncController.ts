// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NGameSyncComponent from "../ncomponent/NGameSyncComponent";
import { NSyncInput } from "../nenity/NFrameInfo";

const {ccclass, property} = cc._decorator;

//实现这个Controller的输入类
class ActorSyncInput extends NSyncInput{
    
    //输入X
    x:Number = null;
    //输入Y
    y:Number = null;

}


@ccclass
export default class ActorSyncController extends NGameSyncComponent<ActorSyncInput> {

    onLoad(){
        super.onLoad();

        //绑定TOUCH事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tEnd, this);

    }

    initInput(): ActorSyncInput {
        return new ActorSyncInput();
    }

    tEnd(event) {
    }

    tMove(event) {

        let delta = event.touch.getDelta();

        //初始化输入
        if(this.getInput().x == null) this.getInput().x = 0;
        if(this.getInput().y == null) this.getInput().y = 0;

        //计算输入
        this.getInput().x += delta.x;
        this.getInput().y += delta.y;
        
    }

    tStart(event) {
    }

    //控制逻辑
    nUpdate(dt: Number,input: ActorSyncInput) {
        this.handleInput(dt,input);
    }

    //处理帧输入数据
    handleInput(dt: Number,input: ActorSyncInput){
    
        //移动Node 事件
        if(input.x != null && input.y != null){
            this.node.position.x += input.x.valueOf();
            this.node.position.y += input.y.valueOf();
        }

    }

}
