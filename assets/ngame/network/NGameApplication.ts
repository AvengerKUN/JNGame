// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ProtoAnyUtil from "../protobuf/ProtoAnyUtil";
import { _decorator, Component, Enum } from 'cc';
import NGameMessageProtobuf from "../protobuf/NGameMessage/NGameMessage.js";
const {ccclass, property} = _decorator;

@ccclass
export default class NGameApplication extends Component {

    @property({displayName:'WebSocket链接',type:String})
    ws:string = "";

    //NGame ID
    @property({displayName:'NGame ID',type:String})
    nId:string = "default";

    //WebSocket 对象
    socket:WebSocket = null;

    //当前Application 消息队列(发送)
    static messages:Map<String,NGameMessageProtobuf.NGameMessage[]> = new Map();

    //普通方法列表 {action:{event:method}}
    static methods = {};
    
    //UUID 方法列表 {uuid : method}
    static uIdMethods = {};

    //NGameApplication 列表
    static applications:Map<String,NGameApplication> = new Map();


    onLoad(){
        //连接WebSocket
        this.nStartNetwork();
    }

    nStartNetwork() {

        //将时间戳标识id
        this.nId = this.nId || Date.now().toString();

        this.socket = new WebSocket(this.nWsPath(`${this.ws}`));
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
            console.log(`${this.nId} WebSocket 连接成功`);
            
            //创建连接成功将对象保存到applications
            NGameApplication.applications.set(this.nId,this);

            //激活发送队列
            NGameApplication.send(this.nId);
        }
        
        this.socket.onmessage = (message) => {

            let data:NGameMessageProtobuf.NGameMessage = NGameMessageProtobuf.NGameMessage.decode(new Uint8Array(message.data));

            //方法参数
            let args = [];

            //判断type_url是否有值 如果没有则是JSON参数传输
            if(data.message.type_url){
                let mObject = null;

                //找到可以解析的解析Protobuf 进行解析
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
                //调用UUID方法
                if(NGameApplication.uIdMethods[data.uid]) NGameApplication.uIdMethods[data.uid](...args);
            }else if(data.action && data.event){
                //调用普通方法
                NGameApplication.methods[`${data.action}`] && 
                NGameApplication.methods[`${data.action}`][`${data.event}`] && 
                NGameApplication.methods[`${data.action}`][`${data.event}`](...args);
            }
            
        }

        this.socket.onclose = () => {
            console.log(`${this.nId} WebSocket 断开连接`);
            //失去连接将applications对象移除
            NGameApplication.applications.delete(this.nId);
        }
        

    }


    //发送消息
    send(message:NGameMessageProtobuf.NGameMessage = null){

        let mess = NGameApplication.messages[`${this.nId}`];

        //将消息添加到队列中
        if(message) mess.push(message);

        //如果未连接成功则返回
        if(this.socket.readyState !== 1 || mess.length <= 0) return;

        //发送消息
        while(message = mess.shift()){
            this.socket.send(NGameMessageProtobuf.NGameMessage.encode(message).finish());
        }

    }

    static send(key:String,message:NGameMessageProtobuf.NGameMessage = null){

        if(!NGameApplication.messages[`${key}`]){
            NGameApplication.messages[`${key}`] = [];
        }
        
        message && NGameApplication.messages[`${key}`].push(message);

        let application = null;
        if(application = NGameApplication.applications.get(`${key}`))
            application.send();
        
    }

    nWsPath(path){
        return path;
    }

}
