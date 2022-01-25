
import { _decorator, Component, Node, director, v2, PhysicsSystem2D, Prefab, instantiate, Button } from 'cc';
import { UserInfo } from '../data/UserData';
import { NAddActor, NSyncInput } from '../nenity/NFrameInfo';
import NGameComponent from '../nscript/NGameComponent';
import { CameraFollow } from '../tools/CameraFollow';
import NPlayerController from './player/NPlayerController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MainScene
 * DateTime = Tue Jan 18 2022 10:00:19 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = MainScene.ts
 * FileBasenameNoExtension = MainScene
 * URL = db://assets/script/scene/MainScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

/**
 * 加入游戏
 */
class AJoinPayer extends NAddActor {
    //玩家ID
    uId:number;
}

class MSceneInput extends NSyncInput {

    //加入游戏
    player:AJoinPayer;

}
 
@ccclass('MainScene')
export class MainScene extends NGameComponent<MSceneInput> {

    //玩家
    @property({displayName:'玩家Prefab',type:Prefab})
    player:Prefab;

    //玩家场景
    @property({displayName:'玩家场景',type:Node})
    players:Node;

    //相机
    @property({displayName:'相机',type:Node})
    camera:Node;

    //射击按钮
    @property({displayName:'射击按钮',type:Button})
    shoot:Button;

    @property({
        type: Node,
        displayName: "子弹地图",
    })
    bulletMap:Node = null;
    static SBulletMap:Node;

    onLoad(){

        super.onLoad();
        MainScene.SBulletMap = this.bulletMap;
    }

    start () {
        PhysicsSystem2D.instance.autoSimulation = false;
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = v2();
    }

    initInput(): MSceneInput {
        return new MSceneInput();
    }

    nUpdate(dt: number, input: MSceneInput, nt: number) {
        if(input.player){
            console.log(input);
        }
        input.player && this.nJoinGame(input.player);
    }
    
    //加入游戏(输入)
    iJoinGame(){
        let player = new AJoinPayer();
        player.uId = UserInfo.userId;
        this.getInput().player = player;
    }

    //加入游戏(实现)
    nJoinGame(player:AJoinPayer){

        //创建角色 (添加到场景)
        let nPlyerNode = instantiate(this.player);

        let nPlayerController:NPlayerController = nPlyerNode.getComponent(NPlayerController);
        nPlayerController.dyInit(this,player);

        nPlayerController.owner = player.uId;
        nPlayerController.bulletMap = this.bulletMap;

        this.players.addChild(nPlyerNode);

        //如果玩家是自己则 绑定
        if(player.uId !== UserInfo.userId) return;

        //相机跟随
        this.camera.getComponent(CameraFollow).fNode = nPlyerNode;

        //绑定射击
        this.shoot.node.on(Button.EventType.CLICK,nPlayerController.iPlayerShoot,nPlayerController);


    }
}
