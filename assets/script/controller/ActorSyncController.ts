// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NGameSyncComponent from "../ncomponent/NGameSyncComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ActorSyncController extends NGameSyncComponent {

    onLoad(){
        super.onLoad();

        //绑定TOUCH事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tEnd, this);

    }

    tEnd(event) {
    }

    tMove(event) {

        let delta = event.touch.getDelta();
        this.node.x += delta.x;
        this.node.y += delta.y;
        
    }

    tStart(event) {
    }

    nUpdate(dt: Number) {
        
    }

}
