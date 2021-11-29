import { google } from "../plugins/proto/game/NGameMessage";
import { GSnakeHelloMessage } from "../plugins/proto/snake/GSnakeMessage";

export default {

    anys:[
        GSnakeHelloMessage,
    ],

    pack(message:any): google.protobuf.Any{

        return google.protobuf.Any.create(
                    {
                        type_url:`type.googleapis.com/${message.constructor.name}`,
                        value: message.constructor.encode(message).finish()
                    }
                )
    }
};