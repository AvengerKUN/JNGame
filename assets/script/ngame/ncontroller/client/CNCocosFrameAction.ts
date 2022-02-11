import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { GameController } from "../../../controller/GameController";
import { NFrameInfo } from "../../NFrameEnity";
import NGameSyncWorld from "../../NGameSyncWorld";

@NGameRPCClass
export class CNCocosFrameAction {

    static nSyncWorld:NGameSyncWorld = null;
    static vGameController:GameController = null;

    /**
     * 接收帧同步
     */
    @NGameRPCFun()
    nGameSyncInputCallBack(nFPSInfo:NFrameInfo){

        let nSyncWorld:NGameSyncWorld = null;
        if(!(nSyncWorld = CNCocosFrameAction.nSyncWorld)) return;

        // console.log("nGameSyncInputCallBack",nFPSInfo);
        
        //添加帧 (测试 isReceiveInfo 是否接受消息 模拟网络波动)
        if(CNCocosFrameAction.vGameController && CNCocosFrameAction.vGameController.isReceiveInfo){
            nSyncWorld.addFrame(nFPSInfo);
        }

    }

}