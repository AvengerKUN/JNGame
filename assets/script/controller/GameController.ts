
import { _decorator, Component, Node, Vec3, Prefab, instantiate, Camera, Canvas, CameraComponent, UITransform, Label, CCBoolean } from 'cc';
import { CNCocosFrameAction } from '../ngame/ncontroller/client/CNCocosFrameAction';
import { NSyncInput } from '../ngame/NFrameEnity';
import NGameSyncComponent from '../ngame/NGameSyncComponent';
import NGameSyncWorld from '../ngame/NGameSyncWorld';
import { WallBlockController } from './WallBlockController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameController
 * DateTime = Thu Feb 10 2022 15:11:07 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = GameController.ts
 * FileBasenameNoExtension = GameController
 * URL = db://assets/script/controller/GameController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
//实现这个Controller的输入类
class IGame extends NSyncInput{
    
    //点击创建
    create:Vec3 = null;
 
}
 
@ccclass('GameController')
export class GameController extends NGameSyncComponent<IGame> {


    @property({displayName:'点击生成的物体',type:Prefab})
    iGenObject:Prefab = null;
    
    @property({displayName:'生成的物体的地图',type:Node})
    iGenWorld:Node = null;

    @property({displayName:'追帧提醒',type:Node})
    tChaseFrame:Node = null;
    @property({displayName:'追帧提醒Text',type:Label})
    tChaseFrameText:Label = null;

    @property({displayName:'是否接受帧数据',type:CCBoolean})
    isReceiveInfo:boolean = true;
    @property({displayName:'是否接受帧数据 Text',type:Label})
    isReceiveInfoText:Label = null;
    
    @property({displayName:'NGame 类',type:NGameSyncWorld})
    ngame:NGameSyncWorld = null;
    @property({displayName:'是否开启预测 Text',type:Label})
    isForecastText:Label = null;

    isClick:boolean = false;

    onLoad(): void {
        super.onLoad();
 
        CNCocosFrameAction.vGameController = this;
        
        console.log("创建点击事件");
 
        //创建点击事件
        // cc.systemEvent.on(cc.Node.EventType.MOUSE_DOWN,this.eMouseDown, this);
        
        this.node.on(Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.tEnd, this);
 
    }

    update() {

        //追帧提示
        let exceed = this.nGameSyncWorld.nFrameQueue.length - this.nGameSyncWorld.nMaxFrameBan;
        this.tChaseFrame.active = exceed > this.nGameSyncWorld.nMaxFrameLoopBan;

        this.tChaseFrameText.string = `正在追帧(${exceed})...`;
        
    }

    //修改接受帧消息状态
    flipReceiveInfo(){
        this.isReceiveInfo = !this.isReceiveInfo;
        this.isReceiveInfoText.string = `断网:${!this.isReceiveInfo}`;
    }

    //修改预测状态
    flipForecastTextInfo(){
        this.ngame.isForecast = !this.ngame.isForecast;
        this.isForecastText.string = `预测:${this.ngame.isForecast}`;
    }

    tStart(e) {
        this.isClick = true;
    }
    tMove(e) {
        let delta = e.getDelta();
        if(delta.x > 0 || delta.y > 0){
            this.isClick = false;
        }
    }
    tEnd(e) {
        if(this.isClick){
            this.eMouseDown(e);
        }
        this.isClick = false;
    }

    //点击事件
    eMouseDown(e) {

        const uiTransform = this.getComponent(UITransform);

        console.log("eMouseDown",e.getUILocation());

        let uiLocation = e.getUILocation()

        //点击创建
        this.getInput().create = uiTransform.convertToNodeSpaceAR(new Vec3(uiLocation.x, uiLocation.y, 0));
    }
 

    initInput(): IGame {
        return new IGame
    }
    nUpdate(dt: number, input: IGame, nt: number) {
        input.create && this.iClickGenerate(input.create);
    }
    nFrameStep(input: IGame) {
    }

    iClickGenerate(input: Vec3) {
        console.log(input);

        if(!input || !this.iGenObject || !this.iGenWorld) return;
 
 
        //生成Prefab 点击位置
        let node = instantiate(this.iGenObject);
        
        // //设置这个类的同步
        let actor = node.getComponent(WallBlockController);
        actor.nGameSyncWorld = this.nGameSyncWorld;
        actor.nId = actor.nGameSyncWorld.nextSyncNumber();
        console.log(actor.nId);
        
 
        node.setPosition(input);
        node.parent = this.iGenWorld;

    }

}

