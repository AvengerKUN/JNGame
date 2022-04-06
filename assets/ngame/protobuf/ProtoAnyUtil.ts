import NStateMessageProtobuf from "./FState/FStateMessage.js";
import NGameMessageProtobuf from "./NGameMessage/NGameMessage.js";

const anys = [
    //存放Protobuf集合
    NStateMessageProtobuf.NStateMessage,
    NStateMessageProtobuf.NStateVec3,
    NStateMessageProtobuf.NStateMessages,
];

const ProtoAnyUtil = {

    anys:anys,

    //解析Protobuf消息
    pack(message:any): NGameMessageProtobuf.google.protobuf.Any{

        return NGameMessageProtobuf.google.protobuf.Any.create(
                    {
                        type_url:`type.googleapis.com/${message.constructor.name}`,
                        value: message.constructor.encode(message).finish()
                    }
                )
                
    },

    fromObject(message:any): NGameMessageProtobuf.google.protobuf.Any{

        let any = null;

        try{
            any = NGameMessageProtobuf.google.protobuf.Any.create({
                value:new TextEncoder().encode(JSON.stringify(message))
            });
        }catch{
            any = NGameMessageProtobuf.google.protobuf.Any.create({
                value:new TextEncoder().encode(`${message}`)
            });
        }

        return any;

    },

    toObject(value:NGameMessageProtobuf.google.protobuf.IAny){

        if(ProtoAnyUtil.isProtobuf(value)){
            return value;
        }else{
            if(!value || !value.value) return null;
            
            let str = (new TextDecoder().decode(value.value))
            try{
                return JSON.parse(str);
            }catch{
                return str;
            }
        }

    },

    isProtobuf(value){

        value = ProtoAnyUtil.unpack(value);

        try{
            for (let index = 0; index < anys.length; index++) {
                const element = anys[index];
                if(element.name === value.constructor.name){
                    //确认是Protobuf对象
                    return true;
                }
            }
        }catch{
        }
        return false;
        
    },

    unpack(data:any){

        try{
            let mObject = null;
            //找到可以解析的解析Protobuf 进行解析
            anys.forEach((cAny) => {
                if(`type.googleapis.com/${cAny.name}` === data.type_url){
                    mObject = cAny;
                }
            });
            
            if(mObject){
                return mObject.decode(data.value);
            }else{
                return data;
            }
        }catch{
            return data;
        }


    }
};

export default ProtoAnyUtil;