

import { _decorator, Component, Enum, CCInteger, Vec3, v3 } from 'cc';
import { NSyncInput } from '../nenity/NFrameInfo';
import NGameStateWorld from './NGameStateWorld';

const {ccclass, property} = _decorator;

//同步类(默认)
export class NStateSync {
    position:Vec3;
    angle:Vec3;
}

/**
 * 同步组件(状态同步) 使用状态同步和帧同步特性
 * 
 * 注意 -> 状态同步需要一个服务器去模拟世界整体逻辑
 */
 @ccclass
 export default abstract class NGameSyncComponent<InputSync extends NSyncInput,StateSync extends NStateSync> extends Component {

    @property({displayName:'属于那个同步类',type:NGameStateWorld})
    nGameSyncWorld:NGameStateWorld = null;

    @property({displayName:'同步ID',type:CCInteger})
    nId:Number = -1;

    //是否是服务器添加的Actor (默认不是)
    isActorServer:boolean = false;

    onLoad(){
        this.initSyncComponent();
    }

    //初始化同步
    initSyncComponent(){
        //将当前Actor 添加 到同步世界中
        this.nGameSyncWorld.nAddSyncActor(this);
    }
    
    //获取状态同步(同步的信息) 如果有多个则重写方法
    vGetStateSync(state:StateSync) : StateSync{
        return Object.assign(state,{
            position:this.node.position,
            angle:this.node.angle,
        })
    }

 }

