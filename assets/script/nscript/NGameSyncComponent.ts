

import { _decorator, Component, Enum, CCInteger, Vec3, v3, Prefab, Node } from 'cc';
import { NAddActor, NStateSync, NSyncInput } from '../nenity/NFrameInfo';
import NGameStateWorld from './NGameStateWorld';

const {ccclass, property} = _decorator;


/**
 * 同步组件(状态同步) 使用状态同步和帧同步特性
 * 
 * 注意 -> 状态同步需要一个服务器去模拟世界整体逻辑
 */
 @ccclass
 export default abstract class NGameSyncComponent<InputSync extends NSyncInput,StateSync extends NStateSync> extends Component {

    @property({displayName:'属于那个同步类',type:NGameStateWorld})
    nGameSyncWorld:NGameStateWorld = null;

    // @property({displayName:'同步ID',type:CCInteger})
    nId:number = null;

    //是否是服务器添加的Actor (默认不是)
    isActorServer:boolean = false;

    //当前输入
    public input:InputSync = null;

    //当前Node 的 Prefab 在 同步世界组件的 位置
    nPrefabIndex:number = null;

    //当前Node 在 World的位置
    nWorldPath:string = null;

    public getInput():InputSync{
        if(!this.input) this.input = this.initInput();
        return this.input;
    }

    onLoad(){

        // if(this.nId){
        //     this.node.name = `sync_${this.nId}`
        // }else{
            
        // }

        this.nFillInfo();
        this.initSyncComponent();

    }

    //补充信息
    nFillInfo(){

        //找到当前Node 的 Prefab 在 同步世界组件的 位置
        (<any>this.node)._prefab.asset;

        if(!this.nPrefabIndex){
            let nPrefab:Prefab = (<any>this.node)._prefab.asset;

            for (const index in this.nGameSyncWorld.nSyncPrefabs) {
                const element = this.nGameSyncWorld.nSyncPrefabs[index];
                if(nPrefab._uuid === element._uuid){
                    this.nPrefabIndex = parseInt(index);
                    break;
                }
            }

        }

        let parent:Node = this.node.getParent();
        this.nWorldPath = "";

        for(let index = 0;(this.nGameSyncWorld.nSyncWorld.uuid != parent.uuid);index++){
            if(index === 0){
                this.nWorldPath = `${parent.name}`
            }else{
                this.nWorldPath = `${parent.name}/${this.nWorldPath}`
            }
            parent = parent.getParent();
        }
        
        console.log(this.nWorldPath);

    }

    //初始化输入对象
    abstract initInput():InputSync;

    //获取状态同步(同步的信息)
    abstract vGetStateSync() : StateSync;

    //初始化同步
    initSyncComponent(){
        //将当前Actor 添加 到同步世界中
        this.nGameSyncWorld.nAddSyncActor(this);
    }

    /**
     * 动态初始化
     * @param nGameSyncComponent 控制的组件
     * @param nAddActor 添加的操作
     */
    dyInit(nGameSyncComponent:NGameSyncComponent<NSyncInput,NStateSync>,nAddActor:NAddActor){
        this.nGameSyncWorld = nGameSyncComponent.nGameSyncWorld;
        this.nId = nAddActor.nId;
    }

    /**
     * 同步状态
     */
     abstract nSyncState(state:StateSync);
     
    /**
     * 逻辑帧
     * @param dt 同步间隔时间
     */
    abstract nUpdate(dt:number,input:InputSync,nt:number);

 }

