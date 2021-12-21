import { NGameRPCClass, NGameRPCFun } from "../../../ngame/decorator/NDecorator";
import { NFrameInfo } from "../../nenity/NFrameInfo";
import NGameSyncWorld from "../../nscript/NGameSyncWorld";

@NGameRPCClass
export class CNCocosFrameAction {

    static nSyncWorld:NGameSyncWorld = null;

    /**
     * 接收帧同步
     */
    @NGameRPCFun()
    nGameSyncInputCallBack(nFPSInfo:NFrameInfo){

        let nSyncWorld:NGameSyncWorld = null;
        if(!(nSyncWorld = CNCocosFrameAction.nSyncWorld)) return;

        //添加帧
        // setTimeout(() => {
        // },1000)
        nSyncWorld.addFrame(nFPSInfo);
    }

}