import { Component } from "cc";
import FStateMonitor from "../moitor/FStateMonitor";
import NGameFStateWorld from "../NGameFStateWorld";



export default class NGameFStateComponent extends Component{
    
    //绑定的World
    world:NGameFStateWorld;

    //监听类
    monitors:Map<String,FStateMonitor<any,any>> = new Map;

    //nId
    nId:number;

    //是否是自己控制
    isowner:boolean = false;

    //网络Prefab Key
    nPrefabKey:number;

    onLoad(){

        if(!this.world)
            this.world = NGameFStateWorld.ins();
        if(!this.nId)
            this.nId = Date.now();
        this.world.addSyncActor(this);

    }

    update(dt){

        this.monitors.forEach(monitor => {
            monitor.update(dt);
        })

    }

    addMonitor(key:string,monitor:FStateMonitor<any,any>){

        this.monitors.set(key,monitor);

    }

    getMonitor(key:string){

        return this.monitors.get(key);

    }

    nset(callback){
        //如果是自己控制则可以修改
        if(this.isowner){
            callback();
        }
    }

}


