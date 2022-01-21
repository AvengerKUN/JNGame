import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { NFrameInfo, NInputMessage, NStateInfo } from "../../../nenity/NFrameInfo";
import NGameStateWorld from "../../NGameStateWorld";
import SNCocosBridgeAction from "../service/SNCocosBridgeAction";



@NGameRPCClass
export class CNCocosBridgeAction {

    static nSyncWorld:NGameStateWorld = null;
    
    /**
     * 接收Actor状态
     */
    @NGameRPCFun()
    vGetStateCallBack(states:NStateInfo){
        console.log(`CNCocosBridgeAction - vGetStateCallBack 接收到`,states);

        let nSyncWorld = CNCocosBridgeAction.nSyncWorld;
        //接收到状态 交给同步世界组件处理
        if(nSyncWorld){
            nSyncWorld.nHandleStates(states);
        }

    }

    /**
     * 接收输入数据操作
     */
    @NGameRPCFun()
    vGetInputCallBack(inputs:NInputMessage[]){

        console.log(`CNCocosBridgeAction - vGetInputCallBack 接收到帧输入`,inputs);

        let nSyncWorld = CNCocosBridgeAction.nSyncWorld;
        //接收到输入 处理输入
        if(nSyncWorld){
            nSyncWorld.nHandleInput(inputs);
        }

    }

    /**
     * 接收帧数据操作
     */
    @NGameRPCFun()
    vGetFrameCallBack(frame:NFrameInfo){
        console.log(`CNCocosBridgeAction - vGetFrameCallBack 接收到帧数据`,frame);

        let nSyncWorld = CNCocosBridgeAction.nSyncWorld;
        //接收到帧数据 处理帧数据
        if(nSyncWorld){
            nSyncWorld.nHandleFrame(frame);
        }

    }

    /**
     * 玩家请求世界 Actor 的 状态
     */
    @NGameRPCFun()
    vAskWorldState(uuid:string){

        SNCocosBridgeAction.vSSendState(uuid,CNCocosBridgeAction.nSyncWorld.nGetStateInfo());

    }

}

