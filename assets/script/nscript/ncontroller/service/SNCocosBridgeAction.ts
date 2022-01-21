import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { NFrameInfo, NInputMessage, NStateInfo } from "../../../nenity/NFrameInfo";


@NGameRPCClass
export default class SNCocosBridgeAction {

    
    /**
     * 玩家加入服务器
     * @param id 服务器Id
     */
    @NGameRPCFun()
    static nJoinServer(id:string){
        console.log(`SNCocosBridgeAction - nJoinServer 加入服务器 : ${id}`);
    }

    /**
     * 向所有客户端发送状态数据 (服务器)
     * @param actors 
     */
    @NGameRPCFun()
    static vSAllSendState(states: NStateInfo) {
        console.log(`SNCocosBridgeAction - vSAllSendState 发送状态数据 : `,states);
    }

    /**
     * 向指定客户端发送状态数据 (服务器)
     * @param actors 
     */
    @NGameRPCFun()
    static vSSendState(uuid:string, states: NStateInfo) {
        console.log(`SNCocosBridgeAction - vSSendState 发送状态数据 : `,states);
    }

    /**
     * 向所有客户端发送帧数据 (服务器)
     * @param frames 
     */
    @NGameRPCFun()
    static vSSendFrame(frames: NFrameInfo){
        console.log(`SNCocosBridgeAction - vSSendFrame 服务器发送帧数据 : `,frames);
    }

    /**
     * 发送帧数据给服务端 (客户端) 操作
     */
    @NGameRPCFun()
    static vCSendInput(inputs: NInputMessage[]) {
        console.log(`SNCocosBridgeAction - vCSendInput 发送帧操作 : `, inputs);
    }
}
