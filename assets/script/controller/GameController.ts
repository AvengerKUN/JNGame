import NGameSyncComponent from "../ncomponent/NGameSyncComponent";
import { CNCocosFrameAction } from "../ncontroller/client/CNCocosFrameAction";
import SNCocosFrameAction from "../ncontroller/service/SNCocosFrameAction";
import { NSyncInput } from "../nenity/NFrameInfo";
import NGameSyncWorld from "../nscript/NGameSyncWorld";
import ActorSyncController from "./ActorSyncController";

const {ccclass, property} = cc._decorator;


//实现这个Controller的输入类
class GameInput extends NSyncInput{
    
    //点击创建
    create:cc.Vec3 = null;

}

@ccclass
export default class GameController extends NGameSyncComponent<GameInput> {

    @property({displayName:'点击生成的物体',type:cc.Prefab})
    iGenObject:cc.Prefab = null;
    
    @property({displayName:'生成的物体的地图',type:cc.Node})
    iGenWorld:cc.Node = null;

    @property({displayName:'是否接受帧数据',type:cc.Boolean})
    isReceiveInfo:boolean = true;
    @property({displayName:'是否接受帧数据 Text',type:cc.Label})
    isReceiveInfoText:cc.Label = null;

    @property({displayName:'NGame 类',type:NGameSyncWorld})
    ngame:NGameSyncWorld = null;
    @property({displayName:'是否开启预测 Text',type:cc.Label})
    isForecastText:cc.Label = null;

    isClick:boolean = false;

    onLoad(): void {
        super.onLoad();

        CNCocosFrameAction.vGameController = this;

        console.log("创建点击事件");

        //创建点击事件
        // cc.systemEvent.on(cc.Node.EventType.MOUSE_DOWN,this.eMouseDown, this);
        
        this.node.on(cc.Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tEnd, this);

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
        //点击创建
        this.getInput().create = this.iGenWorld.convertToNodeSpaceAR(e.getLocation());
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


    initInput(): GameInput {
        return new GameInput();
    }
    nUpdate(dt: number, input: GameInput, nt: number) {
        this.iClickGenerate(input.create);
    }
    nFrameStep(input: GameInput) {

    }

    //点击创建Prefab事件
    iClickGenerate(input:cc.Vec3){
        if(!input || !this.iGenObject || !this.iGenWorld) return;


        //生成Prefab 点击位置
        let node = cc.instantiate(this.iGenObject);
        
        //设置这个类的同步
        let actor = node.getComponent(ActorSyncController);
        actor.nGameSyncWorld = this.nGameSyncWorld;
        actor.nId = actor.nGameSyncWorld.nextSyncNumber();
        console.log(actor.nId);
        

        node.position = input;
        node.parent = this.iGenWorld;

    }

    /**
     * 预测 更新 通常保存状态
     */
    nForecastUpdate(index:number){}

    /**
     * 回滚帧 通常预测失败之后调用 需要处理回滚逻辑
     */
    nForecastRollBack(index:number){}
    
}