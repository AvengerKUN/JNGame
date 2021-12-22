// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import NGameSyncComponent from "../ncomponent/NGameSyncComponent";
import { NFrameInfo, NSyncInput } from "../nenity/NFrameInfo";

const {ccclass, property} = cc._decorator;

//实现这个Controller的输入类
class ActorSyncInput extends NSyncInput{
    
    //-------- 修改node位置 -------
    //输入X
    x:number = null;
    //输入Y
    y:number = null;

    //-------- 抛node ----------
    ball:cc.Vec2 = null;

    //-------- 修改物理状态 ------
    bodyType:cc.RigidBodyType = null;

}


@ccclass
export default class ActorSyncController extends NGameSyncComponent<ActorSyncInput> {

    //上次触碰移动
    deltaLast: any;

    //上一次位置
    lastNodePos: cc.Vec3;
    //移动位置
    iNodeMove: cc.Vec3;
    //移动时间
    iNodeMoveTime: number = 0;

    rigidBody: cc.RigidBody = null;

    // ------ 添加物理预测属性(基础 NGameSyncComponent 只预测 位置旋转) ---------
    nLastLinearVelocity: cc.Vec2[] = []; //物理移动速度
    nLastAngularVelocity: number[] = []; //物理旋转速度
    nLastLinearDamping: number[] = []; //物理旋转速度
    nLastAngularDampingy: number[] = []; //物理旋转速度

    onLoad(){
        super.onLoad();

        //绑定TOUCH事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.tEnd, this);
        
        this.rigidBody = this.getComponent(cc.RigidBody);

    }
    protected update(dt: number): void {
        let int;
    }

    initInput(): ActorSyncInput {
        return new ActorSyncInput();
    }


    //开始触碰
    tStart(event) {
        //修改刚体状态 (静态)
        this.getInput().bodyType = cc.RigidBodyType.Static;
    }

    //移动触碰
    tMove(event) {

        let delta = event.touch.getDelta();

        //初始化输入
        if(this.getInput().x == null) this.getInput().x = 0;
        if(this.getInput().y == null) this.getInput().y = 0;

        //记录上一次移动
        this.deltaLast = delta;

        //计算输入
        this.getInput().x += delta.x;
        this.getInput().y += delta.y;
        
    }

    //松开触碰
    tEnd(event) {

        console.log("tEnd");
        
        //是否有上一次触碰移动数据
        if(this.deltaLast){
            //计算输入
            this.getInput().ball = new cc.Vec2(this.deltaLast.x*100,this.deltaLast.y*100);
        }
        
        //修改刚体状态 (动态)
        this.getInput().bodyType = cc.RigidBodyType.Dynamic;

    }


    /**
     * 控制逻辑
     * @param dt 更新间隔
     * @param input 输入
     * @param nt 服务器间隔
     */
    nUpdate(dt: number,input: ActorSyncInput,nt:number) {

        if(input.x != null || input.y != null || input.ball != null || input.bodyType != null){
            console.log(input,this.node.position.clone(),this.node.angle);
        }

        //执行移动输入
        this.upInputMove(dt.valueOf(),input,nt);

    }
    
    //当前帧结束
    nFrameStep(input: ActorSyncInput) {
        //执行修改刚体状态输入
        this.upInputBodyType(input.bodyType);
        //执行抛输入
        this.ballActor(input.ball);
    }

    // ----------- 预测 -------------
    /**
     * 预测 更新 通常保存状态
     */
     nForecastUpdate(index:number){
        console.log("预测",index,this.node.angle);
        super.nForecastUpdate(index);
        //将当前状态保存起来 用于回滚
        this.nLastLinearVelocity[index] = this.rigidBody.linearVelocity;
        this.nLastAngularVelocity[index] = this.rigidBody.angularVelocity;
        this.nLastLinearDamping[index] = this.rigidBody.linearDamping;
        this.nLastAngularDampingy[index] = this.rigidBody.angularDamping;

    }

    /**
     * 回滚帧 通常预测失败之后调用 需要处理回滚逻辑
     */
    nForecastRollBack(index:number,frame:NFrameInfo){
        console.log("预测失败 进行回滚");
        console.log(index,this.nLastPositions,this.nLastAngles,this.nLastPositions[index],this.nLastAngles[index],frame);
        
        super.nForecastRollBack(index,frame);

        //将当前状态 回滚回去
        this.rigidBody.linearVelocity = this.nLastLinearVelocity[index];
        this.rigidBody.angularVelocity = this.nLastAngularVelocity[index];
        this.rigidBody.linearDamping = this.nLastLinearDamping[index];
        this.rigidBody.angularDamping = this.nLastAngularDampingy[index];

        //回滚完 将预测初始化
        this.nLastLinearVelocity = [];
        this.nLastAngularVelocity = [];
        this.nLastLinearDamping = [];
        this.nLastAngularDampingy = [];

    }

    //执行 bodyType 输入 修改刚体状态
    upInputBodyType(bodyType:cc.RigidBodyType){

        if(bodyType !== null){
            this.rigidBody.type = bodyType;
        }

    }

    //执行 抛 
    ballActor(ball:cc.Vec2){

        if(!ball) return;

        //给抛力
        this.rigidBody.linearVelocity = ball;

    }

    //处理帧输入数据
    upInputMove(dt: number,input: ActorSyncInput,nt:number){

        // //插值
        // let move = (function (){
        //     if(this.iNodeMoveTime / nt < 1){
        //         this.node.position = this.node.position.lerp(this.iNodeMove,Math.min(this.iNodeMoveTime / nt,1),this.lastNodePos);
        //     }else{
        //         this.iNodeMove = null;
        //     }
        // }).bind(this)

        // //没有输入
        // if(input.x == null || input.y == null) {

        //     //如果需要插值则插值
        //     if(!this.iNodeMove) return;

        //     this.iNodeMoveTime += dt;
        //     move();

        //     return
        // };

        // if(this.iNodeMove) this.node.position = this.iNodeMove;
        // //移动
        // this.lastNodePos = this.node.position;
        // //覆盖移动位置
        // this.iNodeMove = new cc.Vec3(this.node.x + input.x,this.node.y + input.y);
        // //覆盖移动时间
        // this.iNodeMoveTime = dt;
        
        // move();

        if(input.x == null || input.y == null) {
            return;
        }
        this.node.position = cc.v3(this.node.x + input.x,this.node.y + input.y);
        // console.log("this.node.position"+this.node.position);

    }

}
