import { uGetFunArgs } from "../../util/util-func";
import CGSocket from "../../socket/CGSocket";
import { NGameMessage } from "../../plugins/proto/game/NGameMessage";
import ProtoAnyUtil from "../../util/ProtoAnyUtil";
import { GSnakeHelloMessage } from "../../plugins/proto/snake/GSnakeMessage";
import { google } from "../../plugins/proto/game/NGameMessage";

type Consturctor = { new (...args: any[]): any };

//转换NGameMessage对象
function toNGameMessage(target,propertyKey,original,args) : NGameMessage{

    let param = [];
    let isAnyObject = false;

    //如果参数长度为1 可能是IAnyObject类型
    if(args.length === 1){
        let isAny = false;
        ProtoAnyUtil.anys.forEach(vAny => {
            if(vAny.name === args[0].constructor.name){
                isAny = true;
            }
        })

        if(isAny){
            param.push(ProtoAnyUtil.pack(args[0]));
            isAnyObject = true;
        }
    }

    let data:NGameMessage = 
                NGameMessage.create({
                    action: target.name,
                    event: propertyKey,
                    message: null
                });
    
    if(isAnyObject){
        data.message = param[0];
    }else{

        let funArgs = uGetFunArgs(original);
        let obj = {};
        funArgs.forEach((val,i) => {
            obj[val] = args[i];
        })

        data.message = 
                google.protobuf.Any.create({
                    value:new TextEncoder().encode(JSON.stringify(obj))
                })
    }

    return data;
}

export enum NRPCMode {
    DEFAULT,UID
}

export function NGameRPCClass(target: any) {
    // console.log(`NGameRPCClass() : ${target.name}`);
}

export function NGameRPCFun(mode:NRPCMode = NRPCMode.DEFAULT) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // console.log(`NGameRPCFun() : ${target}`,propertyKey,descriptor);

        //将方法保存到calls中
        if(!CGSocket.calls[`${target.constructor.name}`]) CGSocket.calls[`${target.constructor.name}`] = {};
        CGSocket.calls[`${target.constructor.name}`][`${propertyKey}`] = descriptor.value;
    
        let original = descriptor.value;
    
        descriptor.value = function (...args) {
    
            const result = original.call(this, ...args);

            //判断是否是默认发送类型
            if(mode !== NRPCMode.DEFAULT) return result;
            
            //如果是则直接发送
            // console.log(`NGameRPCFun() Run : ${target.name}-${propertyKey}`);
    
            CGSocket.ws.send(NGameMessage.encode(toNGameMessage(target,propertyKey,original,args)).finish())
    
            return result;
        }
    }
}

export function NUIDMode(value:number){

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        
        // console.log(`NUIDMode() : ${target}`,propertyKey,descriptor);
        //将方法保存到uids中
        CGSocket.uids[value] = descriptor.value;
        
        let original = descriptor.value;
    
        descriptor.value = function (...args) {

            const result = original.call(this, ...args);

            // console.log(`NUIDMode() Run : ${target.name}-${propertyKey}`);

            let data:NGameMessage = toNGameMessage(target,propertyKey,original,args);

            //重构NGameMessage 为 UID
            data.action = null;
            data.event = null;
            data.uid = value;
            
            CGSocket.ws.send(NGameMessage.encode(data).finish())

            return result;
        }

    }

}
