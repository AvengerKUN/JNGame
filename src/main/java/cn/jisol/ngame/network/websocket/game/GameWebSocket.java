package cn.jisol.ngame.network.websocket.game;

import cn.jisol.ngame.client.defalut.DefaultNClient;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.room.defalut.DefaultNRoom;
import cn.jisol.ngame.network.websocket.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.network.websocket.encoders.DefaultProtoBufEncoder;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ServerEndpoint(
    value = "/game/{roomId}/{uuid}",
    encoders = {DefaultProtoBufEncoder.class},
    decoders = {DefaultProtoBufDecoder.class}
)
@Controller
public class GameWebSocket {

    public static final Map<String, DefaultNRoom> ROOMS = new HashMap<>();

    @OnOpen
    public void onOpen(Session session){

        String roomId = session.getPathParameters().get("roomId");
        String uuid = session.getPathParameters().get("uuid");
        DefaultNRoom room = ROOMS.get(roomId);

        if(Objects.isNull(room)){
            //创建一个房间
            room = new DefaultNRoom(roomId);
            ROOMS.put(room.getUuid(),room);
        }

        DefaultNClient client = new DefaultNClient(uuid,session);
        room.addClient(client);
        client.setRoom(room);

    }

    @OnMessage
    public void onMessage(Session session,NGameMessage message){
        //找到用户

        String roomId = session.getPathParameters().get("roomId");
        String uuid = session.getPathParameters().get("uuid");
        if(Objects.nonNull(ROOMS.get(roomId))){
            ROOMS.get(roomId).getClients().forEach(
                client -> {
                    if(client.getUuid().equals(uuid))
                        client.onMessage(message);
                }
            );
        }

    }

    @OnClose
    public void onClose(Session session){
        String roomId = session.getPathParameters().get("roomId");
        String uuid = session.getPathParameters().get("uuid");

        ROOMS.get(roomId).getClients().removeIf(client -> client.getUuid().equals(uuid));
    }

    @OnError
    public void onError(Session session, Throwable t){
        t.printStackTrace();
    }

}
