
import { _decorator, Component, Enum, Vec2, RigidBody2D } from 'cc';
import { NFrameInfo, NSyncInput } from '../ngame/NFrameEnity';
import NGameSyncComponent from '../ngame/NGameSyncComponent';

const {ccclass, property} = _decorator;

class IPlayer extends NSyncInput{

    //力
    power:Vec2 = null;
    
}

@ccclass
export default class PlayerController extends NGameSyncComponent<IPlayer>{

    body: RigidBody2D | null = null;
    //移动速度
    moveSpeed:number = 3000;

    onLoad(){
        super.onLoad();
        this.body = this.node.getComponent(RigidBody2D);
    }
    
    initInput(): IPlayer {
        return new IPlayer;
    }

    iLeftPower(){
        this.getInput().power = new Vec2(-1,0);
    }
    iRightPower(){
        this.getInput().power = new Vec2(1,0);
    }
    iTopPower(){
        this.getInput().power = new Vec2(0,1);
    }

    nUpdate(dt: number, input: IPlayer, nt: number) {
        //移动
        input.power && this.nInputMove(Object.assign(new Vec2(),input.power).multiply2f(this.moveSpeed * (dt / 1000),this.moveSpeed * (dt / 1000)+200));
    }

    nInputMove(power: Vec2) {
        console.log("nInputMove",power);
        this.body.applyForceToCenter(power, true);

    }

    /**
     * 预测 更新 通常保存状态
     */
    nForecastUpdate(index:number){
        super.nForecastUpdatePhysics(this.body,index);
    }

    /**
     * 回滚帧 通常预测失败之后调用 需要处理回滚逻辑
     */
    nForecastRollBack(index:number,frame:NFrameInfo){
        super.nForecastRollBackPhysics(this.body,index,frame);
    }

    nFrameStep(input: IPlayer) {
        
    }

}
