import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import NStateMessageProtobuf from "../../../../ngame/protobuf/FState/FStateMessage.js";
import { NSFrameInfo, NStateMessage } from "../../../../ngame/sync/enity/NStateEnity";
import NGameDemoFStateWorld from "../../NGameDemoFStateWorld";

@NGameRPCClass
export default class CNCocos3DDemoAction {

    @NGameRPCFun()
    nSyncCallBack(states:NStateMessageProtobuf.NStateMessages){

        if(NGameDemoFStateWorld.ins().isStart){

            NGameDemoFStateWorld.ins().nUpdateFrameState(states);

        }

    }

    /**
     * 其他玩家加入了游戏
     */
    @NGameRPCFun()
    nJoinGame(){

        console.log("CNCocos3DDemoAction - nJoinGame");

        if(NGameDemoFStateWorld.ins().isStart){

            //向其他玩家发送本地完整状态
            NGameDemoFStateWorld.ins().nNvSendMonitor();

        }

    }

    /**
     * 删除指定ids
     * @param offlineIds
     */
    @NGameRPCFun()
    nDeleteIds(ids:Array<number>){

        //删除场景中的nId

        if(NGameDemoFStateWorld.ins().isStart){

            ids.forEach((nId) => {
                NGameDemoFStateWorld.ins().delete(nId);
            })

        }

    }

    /**
     * 更新ID
     */
    @NGameRPCFun()
    nUpdateId(id:number,type:string){
        
        console.log("CNCocos3DDemoAction - nUpdateId",id,type);

        if(NGameDemoFStateWorld.ins().isStart){

            NGameDemoFStateWorld.ins().nSyncActors.forEach(actor => {
                if(actor.nId === id){
                    actor.isowner = true;
                }
            })

        }

    }


}
