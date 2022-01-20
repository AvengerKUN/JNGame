import { Vec3 } from "cc";


/**
 * 基础帧同步 输入数据
 */
export abstract class NSyncInput{

}

//同步类(默认)
export class NStateSync {
    position:Vec3;
    angle:number;
}

//帧输入数据
export class NInputMessage {

    //针对某个SyncComponent
    nId:number;
    //操作
    input:NSyncInput;

}

//状态输入数据
export class NStateMessage {
    
    //针对某个SyncComponent
    nId:number;
    //Node 的 Prefab
    prefab:number;
    //Node 的 Path
    path:string;
    //状态
    state:NStateSync;

}

//帧数据实体
export class NFrameInfo {
    i:number;
    ds:Array<NInputMessage> = [];

    public getDs():Array<NInputMessage>{
        if(!this.ds) this.ds = [];
        return this.ds;
    }
}

//状态数据实体
export class NStateInfo {
    i:number;
    ds:Array<NStateMessage> = [];

    public getDs():Array<NStateMessage>{
        if(!this.ds) this.ds = [];
        return this.ds;
    }
}
