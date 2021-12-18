

/**
 * 基础帧同步 输入数据
 */
export abstract class NSyncInput{

}

//帧输入数据
export class NInputMessage {

    //针对某个SyncComponent
    nId:Number = null;
    //操作
    input:NSyncInput = null;

}

//帧数据实体
export class NFrameInfo {
    i:Number = 0;
    ds:Array<NInputMessage> = null;
}
