import NGameMessageProtobuf from "./NGameMessage/NGameMessage.js";

export default {

    anys:[
        //存放Protobuf集合
    ],

    //解析Protobuf消息
    pack(message:any): NGameMessageProtobuf.google.protobuf.Any{
        return NGameMessageProtobuf.google.protobuf.Any.create(
                    {
                        type_url:`type.googleapis.com/${message.constructor.name}`,
                        value: message.constructor.encode(message).finish()
                    }
                )
    }
};