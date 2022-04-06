import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import NStateMessageProtobuf from "../../../../ngame/protobuf/FState/FStateMessage.js";
import { NStateMessage } from "../../../../ngame/sync/enity/NStateEnity";


@NGameRPCClass
export default class SNCocos3DDemoAction {

    @NGameRPCFun()
    static nGameUpdate(){
        console.log(" nGameUpdate ======> ");
    }

    /**
     * 提交状态帧数据
     */
    @NGameRPCFun()
    static nGameFrameState(states:NStateMessageProtobuf.NStateMessages){
    }

    /**
     * 添加玩家离线nid
     * (玩家离线之后会通知所有玩家nid)
     */
    @NGameRPCFun()
    static nAddLocalId(nId:number){}

    /**
     * 玩家离线则转让ID
     * (玩家离线之后会把权限转让)
     */
    @NGameRPCFun()
    static nAddWorldId(nId:number){}

}

