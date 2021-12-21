import SNCocosFrameAction from "../ncontroller/service/SNCocosFrameAction";
import { NInputMessage, NSyncInput } from "../nenity/NFrameInfo";
import NGameSyncWorld from "../nscript/NGameSyncWorld";

const {ccclass, property} = cc._decorator;

/**
 * 同步组件
 * 
 * 注意 -> 因为同步模式是帧同步 操控都是通过输入的方式去操作场景 所以需要一个输入类 全程通过输入类去控制对象
 */
@ccclass
export default abstract class NGameSyncComponent<InputSync extends NSyncInput> extends cc.Component {

    @property({displayName:'属于那个同步类',type:NGameSyncWorld})
    nGameSyncWorld:NGameSyncWorld = null;

    @property({displayName:'同步ID',type:cc.Integer})
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

    

    //定时保存操作 到 服务器

    
}