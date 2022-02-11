
import { _decorator, Node, __private, Vec2, Vec3, RigidBody, ERigidBody2DType, RigidBody2D } from 'cc';
import { NFrameInfo, NSyncInput } from '../ngame/NFrameEnity';
import NGameSyncComponent from '../ngame/NGameSyncComponent';
const { ccclass, property } = _decorator;

class IWallBlock extends NSyncInput{

    //-------- 修改node位置 -------
    //输入X
    x:number = null;
    //输入Y
    y:number = null;

    //-------- 抛node ----------
    ball:Vec2 = null;

    //-------- 修改物理状态 ------
    bodyType:ERigidBody2DType = null;

}
 
@ccclass('WallBlockController')
export class WallBlockController extends NGameSyncComponent<IWallBlock> {

    //上次触碰移动
    deltaLast: any;

    //上一次位置
    lastNodePos: Vec3;
    //移动位置
    iNodeMove: Vec3;
    //移动时间
    iNodeMoveTime: number = 0;

    rigidBody: RigidBody2D = null;

    onLoad(){
        super.onLoad();
        
        //绑定TOUCH事件
        this.node.on(Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.tEnd, this);
        
        this.rigidBody = this.getComponent(RigidBody2D);
    }
    tStart(event) {

        //修改刚体状态 (静态)
        this.getInput().bodyType = ERigidBody2DType.Static;

    }
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
    tEnd(event) {
        
        //是否有上一次触碰移动数据
        if(this.deltaLast){
            //计算输入
            this.getInput().ball = new Vec2(this.deltaLast.x,this.deltaLast.y);
        }
        
        //修改刚体状态 (动态)
        this.getInput().bodyType = ERigidBody2DType.Dynamic;

    }

    initInput(): IWallBlock {
        return new IWallBlock
    }

    nUpdate(dt: number, input: IWallBlock, nt: number) {

        //执行移动输入
        this.upInputMove(dt.valueOf(),input,nt);

    }

    /**
     * 预测 更新 通常保存状态
     */
    nForecastUpdate(index:number){
        super.nForecastUpdatePhysics(this.rigidBody,index);
    }

    /**
     * 回滚帧 通常预测失败之后调用 需要处理回滚逻辑
     */
    nForecastRollBack(index:number,frame:NFrameInfo){
        super.nForecastRollBackPhysics(this.rigidBody,index,frame);
    }


    nFrameStep(input: IWallBlock) {
        //执行修改刚体状态输入
        this.upInputBodyType(input.bodyType);
        //执行抛输入
        this.ballActor(input.ball);
    }

    //执行 bodyType 输入 修改刚体状态
    upInputBodyType(bodyType:ERigidBody2DType){

        if(bodyType !== null){
            this.rigidBody.type = bodyType;
        }

    }

    //执行 抛 
    ballActor(ball:Vec2){

        if(!ball) return;

        //给抛力
        this.rigidBody.linearVelocity = ball;

    }
    
    //处理帧输入数据
    upInputMove(dt: number,input: IWallBlock,nt:number){

        //插值
        let move = (function (){
            if(this.iNodeMoveTime / nt < 1){
                this.node.position = this.node.position.lerp(this.iNodeMove,Math.min(this.iNodeMoveTime / nt,1),this.lastNodePos);
            }else{
                this.iNodeMove = null;
            }
        }).bind(this)

        //没有输入
        if(input.x == null || input.y == null) {

            //如果需要插值则插值
            if(!this.iNodeMove) return;

            this.iNodeMoveTime += dt;
            move();

            return
        };

        if(this.iNodeMove) this.node.position = this.iNodeMove;
        //移动
        this.lastNodePos = this.node.position;
        //覆盖移动位置
        this.iNodeMove = new Vec3(this.node.position.x + input.x,this.node.position.y + input.y);
        //覆盖移动时间
        this.iNodeMoveTime = dt;
        
        move();

    }

}
