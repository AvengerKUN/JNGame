// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SNCocosFrameAction from "./script/ncontroller/service/SNCocosFrameAction";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    onLoad () {

        cc.director.getCollisionManager().enabled = true;
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.enabledAccumulator = true;
        manager.FIXED_TIME_STEP = 1/30;
        manager.gravity = cc.v2(0, -630);

    }

}
