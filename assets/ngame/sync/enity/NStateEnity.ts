import { Prefab } from "cc";

export class NPrefab {
    key:any;
    prefab:Prefab;

    constructor(key,prefab){
        this.key = key;
        this.prefab = prefab;
    }
}

//Prefeb管理器
export class NPrefabManager{

    prefabs:Map<any,NPrefab> = new Map;

    add(key:any,prefab:Prefab){

        this.prefabs.set(key,new NPrefab(key,prefab));

    }

    get(key:any){

        return this.prefabs.get(key);

    }

}

//帧输入数据
export class NStateMessage {

    //针对某个SyncComponent
    nId:number = null;
    //状态
    states:object = {};
    //绑定的prefab
    prefab:any;

}



//帧数据实体
export class NSFrameInfo {
    i:number = null;
    ds:Array<NStateMessage> = [];

    public getDs():Array<NStateMessage>{
        if(!this.ds) this.ds = [];
        return this.ds;
    }
}

