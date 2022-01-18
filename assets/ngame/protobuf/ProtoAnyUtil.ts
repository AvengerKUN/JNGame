import google from "./NGameMessage/NGameMessage.js";

export default {

    anys:[
        //存放Protobuf集合
    ],

    //解析Protobuf消息
    pack(message:any): google.protobuf.Any{
        return google.protobuf.Any.create(
                    {
                        type_url:`type.googleapis.com/${message.constructor.name}`,
                        value: message.constructor.encode(message).finish()
                    }
                )
    }
};