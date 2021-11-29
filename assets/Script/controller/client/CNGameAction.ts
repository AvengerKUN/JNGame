import ActionSync from "../../action/ActionSync";
import DSyncMessage from "../../dto/DSyncMessage";
import GAction from "../../entity/action/GAction";
import GOwner from "../../entity/GOwner";
import Helloworld from "../../Helloworld";
import { GSnakeHelloMessage } from "../../plugins/proto/snake/GSnakeMessage";
import { NGameRPCClass, NGameRPCFun, NRPCMode, NUIDMode } from "../../rpc/decorator/NDecorator";
import NSyncComponent from "../../rpc/NSyncComponent";

@NGameRPCClass
export class CNGameAction {

    static helloWorld:Helloworld = null;
    static sindex:number = 0;

    @NGameRPCFun()
    nGameProtoBuf(message:GSnakeHelloMessage){
        console.log('接收服务器RPC[nGameProtoBuf]',message);
    }

    @NGameRPCFun()
    nGameParams(name:string,userId:number,user:any){
        console.log('接收服务器RPC[nGameParams]',name,userId,user);
    }

    @NGameRPCFun()
    nGameHello(){
        console.log('接收服务器RPC[nGameHello]');
    }
    
    @NUIDMode("1")
    @NGameRPCFun(NRPCMode.UID)
    nGameUUIDMode(){
        console.log('接收服务器RPC[nGameUUIDMode]');
    }

    @NGameRPCFun()
    nGameSyncCallBack(fInfo:any){

        CNGameAction.sindex = fInfo.i;
        if(!CNGameAction.helloWorld) return;

        fInfo.ds.forEach(data => {
            let message:DSyncMessage = Object.assign(new DSyncMessage(),data);

            switch (message.type) {
                case DSyncMessage.D_SYNC_ACTION:

                    let action:GAction = Object.assign(new GAction(),message.message);

                    let actionSync = <NSyncComponent>CNGameAction.vGameActionSync(action.uid);
                    actionSync.mindex = fInfo.i;
                    actionSync.uServerData(action);
                    
                    break;
                case DSyncMessage.D_SYNC_OWNER:

                    let owner:GOwner = Object.assign(new GOwner(),message.message);

                    let ownerSync:NSyncComponent = <NSyncComponent>CNGameAction.vGameActionSync(owner.uid);
                    //将强制权限关闭
                    ownerSync.owner = false;
                    // console.log(owner.im,owner.v || fInfo.i);

                    if(owner.im)
                        ownerSync.mOwner = owner.v || fInfo.i;
                    else
                        ownerSync.oOwner = owner.v || fInfo.i;

                    break;
            }
            


        })

        // let action:GAction = Object.assign(new GAction(),data);

        // if(!CNGameAction.helloWorld) return;

        // let actionNode = null;
        // if(!(actionNode = CNGameAction.helloWorld.map.getChildByName(action.uid))){
        //     // actionNode = CNGameAction.helloWorld.addAction();
        //     // actionNode.name = `${action.uid}`;
        // }
        // let actionSync = actionNode.getComponent(ActionSync);

        // if(action.angle) actionNode.angle = action.angle;
        // if(action.position) actionNode.position = action.position;

    }

    static vGameAction(uid:string){
        let actionNode = null;
        if(!(actionNode = CNGameAction.helloWorld.map.getChildByName(uid))){
            actionNode = CNGameAction.helloWorld.addAction();
            actionNode.name = uid;
        }
        return actionNode;
    }
    static vGameActionSync(uid:string){
        let actionNode = CNGameAction.vGameAction(uid);
        return <NSyncComponent>actionNode.getComponent(ActionSync);
    }

}
