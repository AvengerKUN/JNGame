// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NGameMessage } from "../protobuf/NGameMessage/NGameMessage.js";
import ProtoAnyUtil from "../protobuf/ProtoAnyUtil";

import { _decorator, Component, Enum } from 'cc';
const {ccclass, property} = _decorator;

//客户端类型
enum NClientType {
    CLIENT, //client
    SERVER //server
}

@ccclass
export default class NGameApplication extends Component {

    //编译时设置导出服务器还是客户端
    @property({displayName:'客户端类型',type:Enum(NClientType), serializable:true})
    ntype:NClientType = NClientType.CLIENT;

    @property({displayName:'WebSocket链接',type:String})
    ws:string = "";

    //NGame ID
    @property({displayName:'NGame ID',type:String})
    nId:string = "default";

    //WebSocket 对象
    socket:WebSocket = null;

    //当前Application 消息队列(发送)
    messages:NGameMessage[] = [];

    //普通方法列表 {action:{event:method}}
    static methods = {};
    
    //UUID 方法列表 {uuid : method}
    static uIdMethods = {};

    //NGameApplication 列表
    static applications:Map<String,NGameApplication> = new Map();


    onLoad(){
        //将时间戳标识id
        this.nId = this.nId || Date.now().toString();

        //连接WebSocket
        this.nStartNetwork();
    }

    nStartNetwork() {

        let ntype = "client";
        switch(this.ntype){
            case NClientType.CLIENT:
                ntype = "client";
                break;
            case NClientType.SERVER:
                ntype = "server";
                break;
        }

        this.socket = new WebSocket(`${this.ws}/${ntype}/${Date.now()}`);
        this.socket.binaryType = 'arraybuffer';

        this.socket.onopen = () => {
            console.log(`${this.nId} WebSocket 连接成功`);
            
            //创建连接成功将对象保存到applications
            NGameApplication.applications.set(this.nId,this);

            //激活发送队列
            this.send();
        }
        
        this.socket.onmessage = (message) => {

            let data:NGameMessage = NGameMessage.decode(new Uint8Array(message.data));

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
            //失去连接将applications对象移除
            NGameApplication.applications.delete(this.nId);
        }
        

    }

    //发送消息
    send(message:NGameMessage = null){

        //将消息添加到队列中
        if(message) this.messages.push(message);

        //如果未连接成功则返回
        if(this.socket.readyState !== 1 || this.messages.length <= 0) return;

        //发送消息
        while(message = this.messages.shift()){
            this.socket.send(NGameMessage.encode(message).finish());
        }

    }

    // update (dt) {}
}
