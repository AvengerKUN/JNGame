import NGameSyncComponent from "../ncomponent/NGameSyncComponent";
import { NSyncInput } from "../nenity/NFrameInfo";
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

    isClick:boolean = false;

    onLoad(): void {
        super.onLoad();

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
        console.log(e);
        console.log(this.isClick);
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
    
}