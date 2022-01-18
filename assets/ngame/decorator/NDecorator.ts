import { uGetFunArgs } from "../util/util-func";
import NGameApplication from "../network/NGameApplication";
import NGameMessage from "../protobuf/NGameMessage/NGameMessage.js";
import ProtoAnyUtil from "../protobuf/ProtoAnyUtil";
import google from "../protobuf/NGameMessage/NGameMessage.js";

type Consturctor = { new (...args: any[]): any };

//转换NGameMessage对象
/**
 * @param target
 * @param propertyKey 
 * @param original 
 * @param args 参数
 */
function toNGameMessage(target,propertyKey,original,args) : NGameMessage{

    //参数列表
    let param = [];
    //传入的是否是Protobuf对象
    let isAnyObject = false;

    //如果参数长度为1 可能是IAnyObject类型
    if(args.length === 1){
        //是否是Protobuf对象
        let isAny = false;
        //通过类名找到相似的 Protobuf对象
        ProtoAnyUtil.anys.forEach(vAny => {
            if(vAny.name === args[0].constructor.name){
                //确认是Protobuf对象
                isAny = true;
            }
        })

        //如果是则将参数 解析成Protobuf对象
        if(isAny){
            param.push(ProtoAnyUtil.pack(args[0]));
            isAnyObject = true;
        }
    }

    //创建基础的 NGameMessage Protobuf对象
    /**
     * action : 类名 - (处理器)
     * event : 方法名 - (事件)
     * message : 消息 - body
     */
    let data:NGameMessage = 
                NGameMessage.create({
                    action: target.name,
                    event: propertyKey,
                    message: null
                });
    
    //如果是 Protobuf对象 将参数赋值
    if(isAnyObject){
        //Protobuf对象 消息Body
        data.message = param[0];
    }else{
        //负责则是 JSON 对象
        //uGetFunArgs 获取参数名称列表
        let funArgs = uGetFunArgs(original);

        //参数JSON - 消息Body
        let obj = {};
        funArgs.forEach((val,i) => {
            obj[val] = args[i];
        })

        //JSON序列化 字节 创建Protobuf Any对象
        data.message = 
                google.protobuf.Any.create({
                    value:new TextEncoder().encode(JSON.stringify(obj))
                })
    }

    //返回结果 - NGameMessage
    return data;
}

//获得指定参数的值
function vGetArgsValue(arg,args,key:string){

    let value = null;

    for (let index = 0; index < arg.length; index++) {
        const element = arg[index];
        if(element === key){
            value = args[index];
        }
    }

    return value;

}


//声明 RPC 类型
export enum NRPCMode {
    //通过类名 + 方法名 找到 方法
    DEFAULT, 
    //通过UID 找到 方法
    UID,
}

// ---------------- RPC AOP 增强器 ----------------

//声明 RPC Class -  类 - (处理器)
export function NGameRPCClass(target: any) {
    // console.log(`NGameRPCClass() : ${target.name}`);
}


//声明 RPC Method -  方法 - (事件)
//默认 NRPCMode - DEFAULT  默认 第一个 NGameApplication
export function NGameRPCFun(mode:NRPCMode = NRPCMode.DEFAULT) {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // console.log(`NGameRPCFun() : ${target}`,propertyKey,descriptor);

        //将方法保存到methods中
        if(!NGameApplication.methods[`${target.constructor.name}`]) NGameApplication.methods[`${target.constructor.name}`] = {};
        NGameApplication.methods[`${target.constructor.name}`][`${propertyKey}`] = descriptor.value;
        
    
        //方法 - descriptor.value - 需要 RPC 的方法
        let original = descriptor.value;
    
        //获取参数名
        let arg = uGetFunArgs(original);

    
        descriptor.value = function (...args) {

            //调用方法接收返回值
            const result = original.call(this, ...args);

            //判断是否是默认发送类型
            if(mode !== NRPCMode.DEFAULT) return result;
            
            //如果是则直接发送
            // console.log(`NGameRPCFun() Run : ${target.name}-${propertyKey}`);
    
            //找到特殊标识 (ngame) 的参数然后找到key 默认: default
            let key:string = vGetArgsValue(arg,args,'ngame') || 'default';

            let application:NGameApplication = NGameApplication.applications.get(key);
            if(application)
                application.send(toNGameMessage(target,propertyKey,original,args))
    
            //返回结果
            return result;
        }
    }
}

/**
 * @param value UID 的 值 用来标识这个方法的ID
 */
export function NUIDMode(value:number){

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        
        // console.log(`NUIDMode() : ${target}`,propertyKey,descriptor);

        //将方法保存到uids中
        NGameApplication.uIdMethods[value] = descriptor.value;

        //方法 - descriptor.value - 需要 RPC 的方法
        let original = descriptor.value;

        //获取参数名
        let arg = uGetFunArgs(original);
    
        descriptor.value = function (...args) {

            //调用方法接收返回值
            const result = original.call(this, ...args);

            // console.log(`NUIDMode() Run : ${target.name}-${propertyKey}`);

            //获取 NGameMessage
            let data:NGameMessage = toNGameMessage(target,propertyKey,original,args);

            //重构NGameMessage 为 UID
            data.action = null;
            data.event = null;
            data.uid = value;
            
            //找到特殊标识 (ngame) 的参数然后找到key 默认: default
            let key:string = vGetArgsValue(arg,args,'ngame') || 'default';
            let application:NGameApplication = NGameApplication.applications.get(key);

            //发送消息
            if(application)
                application.send(data)

            //返回结果
            return result;
        }

    }

}
