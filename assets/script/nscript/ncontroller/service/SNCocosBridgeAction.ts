import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { NStateSync } from "../../NGameSyncComponent";


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
     * 发送状态数据
     * @param actors 
     */
    @NGameRPCFun()
    static vSendState(states: NStateSync[]) {
        console.log(`SNCocosBridgeAction - vSendState 发送帧数据 : `,states);
    }

}
