import DUserInfo from "../data/DUserInfo";
import { google, NGameMessage } from "../plugins/proto/game/NGameMessage";
import { GSnakeHelloMessage } from "../plugins/proto/snake/GSnakeMessage";
import ProtoAnyUtil from "../util/ProtoAnyUtil";

class CGSocket {

    ws:WebSocket;
    /**
     * {action:{event}}
     */
    calls:any = {};
    /**
     * {uid:fun}
     */
    uids:any = {};

    constructor(){
        this.ws = new WebSocket(`ws://localhost:9190/game/123456/${DUserInfo.userId}`);
        this.ws.binaryType = 'arraybuffer';
        
        this.ws.onmessage = (message) => {

            let data:NGameMessage = NGameMessage.decode(new Uint8Array(message.data));

            let args = [];

            //判断type_url是否有值 如果没有则是JSON参数传输
            if(data.message.type_url){
                let mObject = null;
                ProtoAnyUtil.anys.forEach((cAny) => {
                    if(`type.googleapis.com/${cAny.name}` === data.message.type_url){
                        mObject = cAny;
                    }
                });
                
                if(mObject){
                    args.push(mObject.decode(data.message.value));
                }

            }else{
                args = JSON.parse(new TextDecoder().decode(data.message.value));
            }

            // console.log(data);

            if(data.uid){
                if(this.uids[data.uid]) this.uids[data.uid](...args);
            }else if(data.action && data.event){
                //调用方法
                if(this.calls[`${data.action}`] && this.calls[`${data.action}`][`${data.event}`]) this.calls[`${data.action}`][`${data.event}`](...args);
            }
            
        }

        this.ws.onclose = () => {
            console.log("onclose");
        }
    }

}

export default new CGSocket();
