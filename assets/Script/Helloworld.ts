import ActionSync from "./action/ActionSync";
import { CNGameAction } from "./controller/client/CNGameAction";
import SNGameAction from "./controller/server/SNGameAction";
import { GSnakeHelloMessage } from "./plugins/proto/snake/GSnakeMessage";
import {uuid} from './util/util-rander'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Prefab)
    action: cc.Prefab = null;
    @property(cc.Node)
    map: cc.Node = null;

    isNetSync = false;

    async onLoad () {

        console.log("onload");

        cc.director.getCollisionManager().enabled = true;
        let manager = cc.director.getPhysicsManager();
        manager.enabled = true;
        manager.enabledAccumulator = true;
        manager.FIXED_TIME_STEP = 1/30;
        manager.gravity = cc.v2(0, -630);

        // SNGameAction.nGameHello();
        // SNGameAction.nGameUUIDMode();
        // SNGameAction.nGameProtoBuf(
        //     GSnakeHelloMessage.create({
        //         value:"123456"
        //     }));
        // SNGameAction.nGameParams("userName",123456,{userId:123456,userName:"userName"});

        CNGameAction.helloWorld = this;

    }

    switchNetSync(){
        if(!this.isNetSync){
            SNGameAction.nGameSyncStart();
            this.isNetSync = true;
        }else{
            SNGameAction.nGameSyncEnd();
            this.isNetSync = false;
        }
    }

    //加入游戏
    joinGame(){

        let actionNode = this.addAction();

        let actionSync = actionNode.getComponent(ActionSync);
        actionSync.joinGame();

    }

    addAction():cc.Node{
        let action = cc.instantiate(this.action);
        action.name = `${new Date().getTime()}`;
        action.parent = this.map;
        action.x = 200;
        action.y = 200;
        // (<ActionSync>action.getComponent(ActionSync)).setIsOwner(false);

        return action;
    }

}
