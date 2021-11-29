import GAction from "../../entity/action/GAction";
import GOwner from "../../entity/GOwner";
import { GSnakeHelloMessage } from "../../plugins/proto/snake/GSnakeMessage";
import { NGameRPCClass, NGameRPCFun, NRPCMode, NUIDMode } from "../../rpc/decorator/NDecorator";

@NGameRPCClass
export default class SNGameAction {
    
    @NGameRPCFun()
    static nGameProtoBuf(message:GSnakeHelloMessage){}

    @NGameRPCFun()
    static nGameParams(name:string,userId:number,user:any){}

    @NGameRPCFun()
    static nGameHello(){}

    @NUIDMode("123456")
    @NGameRPCFun(NRPCMode.UID)
    static nGameUUIDMode(){}

    /**
     * 开始帧同步模式
     */
    @NGameRPCFun()
    static nGameSyncStart(){}

    /**
     * 结束帧同步模式
     */
    @NGameRPCFun()
    static nGameSyncEnd(){}


    /**
     * 获取Action权限
     * @param action 
     */
    @NGameRPCFun()
    static nGameSyncAuth(action:GOwner){}

    /**
     * 存储到帧同步Action
     */
    @NGameRPCFun()
    static nGameSyncSave(action:GAction){}

}

// export default new SNGameAction();
