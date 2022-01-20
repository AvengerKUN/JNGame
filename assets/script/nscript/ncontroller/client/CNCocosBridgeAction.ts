import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { NFrameInfo, NInputMessage, NStateInfo } from "../../../nenity/NFrameInfo";
import NGameStateWorld from "../../NGameStateWorld";



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

        console.log(`CNCocosBridgeAction - vGetStateCallBack 接收到帧输入`,inputs);

    }

    /**
     * 接收帧数据操作
     */
    @NGameRPCFun()
    vGetFrameCallBack(frame:NFrameInfo){
        console.log(`CNCocosBridgeAction - vGetStateCallBack 接收到帧数据`,frame);
    }

}

