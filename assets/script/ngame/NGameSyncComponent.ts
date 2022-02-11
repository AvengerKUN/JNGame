import SNCocosFrameAction from "./ncontroller/service/SNCocosFrameAction";
import { NFrameInfo, NInputMessage, NSyncInput } from "./NFrameEnity";
import NGameSyncWorld from "./NGameSyncWorld";

import { _decorator, Component, Enum, CCInteger, game, PhysicsSystem2D, PhysicsSystem, Vec2, Quat, Vec3 } from 'cc';

const {ccclass, property} = _decorator;


/**
 * 同步组件
 * 
 * 注意 -> 因为同步模式是帧同步 操控都是通过输入的方式去操作场景 所以需要一个输入类 全程通过输入类去控制对象
 */
@ccclass
export default abstract class NGameSyncComponent<InputSync extends NSyncInput> extends Component {

    @property({displayName:'属于那个同步类',type:NGameSyncWorld})
    nGameSyncWorld:NGameSyncWorld = null;

    @property({displayName:'同步ID',type:CCInteger})
    nId:Number = -1;

    /**
     * 未处理输入缓存
     */
    unInputSyncs:Array<InputSync> = [];

    //当前input执行
    inputExecute:InputSync = null;

    //当前输入
    public input:InputSync = null;

    public getInput():InputSync{
        if(!this.input) this.input = this.initInput();
        return this.input;
    }


    // ---------------- 实现需要预测和回滚的属性 --------------------
    //预测 的状态
    nLastPositions:Vec3[] = [];
    nLastRotations:number[] = [];
    
    //预测 的状态
    nLastLinearVelocitys:Vec2[] = [];
    nLastLinearDamping:number[] = [];
    nLastAngularVelocity:number[] = [];
    nLastAngularDamping:number[] = [];


    onLoad(){
        //添加同步Actor
        this.nGameSyncWorld.nSyncActors.push(this);
    }

    //初始化输入对象
    abstract initInput():InputSync;

    /**
     * 同步逻辑帧
     * @param dt 同步间隔时间
     */
    abstract nUpdate(dt:number,input:InputSync,nt:number);

    //当前帧结束
    abstract nFrameStep(input:InputSync);

    //获取下一帧输入
    vNextInputSync(){
        this.inputExecute = this.unInputSyncs.length ? this.unInputSyncs.shift() : this.initInput();
        return this.inputExecute;
    }

    
    // /**
    //  * 预测通知 开始预测的时候调用 通常保存状态
    //  */
    //  nForecastStart(){
    //     //将当前状态保存起来 用于回滚
    //     this.nLastPosition = this.node.position;
    //     this.nLastRotation = this.node.rotation;
    // }

    /**
     * 预测 更新 通常保存状态
     */
    nForecastUpdate(index:number){
        
        //将当前状态保存起来 用于回滚
        this.nLastPositions[`${index}`] = this.node.getPosition().clone();
        this.nLastRotations[`${index}`] = this.node.angle;
    }

    /**
     * 回滚帧 通常预测失败之后调用 需要处理回滚逻辑
     */
    nForecastRollBack(index:number,frame:NFrameInfo){

        //将当前状态 回滚回去
        this.node.setPosition(this.nLastPositions[`${index}`]);
        //将当前状态 回滚回去
        this.node.angle = this.nLastRotations[`${index}`];

        //回滚完 将预测初始化
        this.nLastPositions = [];
        this.nLastRotations = [];

    }
    

    /**
     * 预测 更新 通常保存状态
     */
     nForecastUpdatePhysics(body,index:number){

        //将当前状态保存起来 用于回滚
        this.nLastPositions[`${index}`] = this.node.getPosition().clone();
        this.nLastRotations[`${index}`] = this.node.angle;

        this.nLastLinearVelocitys[`${index}`] = body.linearVelocity;
        this.nLastLinearDamping[`${index}`] = body.linearDamping;
        this.nLastAngularVelocity[`${index}`] = body.angularVelocity;
        this.nLastAngularDamping[`${index}`] = body.angularDamping;

    }

    /**
     * 回滚帧 通常预测失败之后调用 需要处理回滚逻辑
     */
    nForecastRollBackPhysics(body,index:number,frame:NFrameInfo){

        this.node.position = this.nLastPositions[`${index}`];
        this.node.angle = this.nLastRotations[`${index}`];

        body.linearVelocity = this.nLastLinearVelocitys[`${index}`]
        body.linearDamping = this.nLastLinearDamping[`${index}`]
        body.angularVelocity = this.nLastAngularVelocity[`${index}`]
        body.angularDamping = this.nLastAngularDamping[`${index}`]


        //回滚完 将预测初始化
        this.nLastLinearVelocitys = [];
        this.nLastLinearDamping = [];
        this.nLastAngularVelocity = [];
        this.nLastAngularDamping = [];
        this.nLastPositions = [];
        this.nLastRotations = [];

    }

}