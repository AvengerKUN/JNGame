import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { NStateSync } from "../../NGameSyncComponent";



@NGameRPCClass
export class CNCocosBridgeAction {
    
    /**
     * 接收Actor状态
     */
    @NGameRPCFun()
    vGetStateCallBack(states:Array<NStateSync>){
        console.log(`CNCocosBridgeAction - vGetStateCallBack 接收到`,states);
    }

}

