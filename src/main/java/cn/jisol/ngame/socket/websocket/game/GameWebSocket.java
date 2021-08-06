package cn.jisol.ngame.socket.websocket.game;

import cn.hutool.json.JSONUtil;
import cn.jisol.ngame.client.defalut.DefaultNClient;
import cn.jisol.ngame.game.action.client.CNGameAction;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.proto.snake.GSnakeMessage.*;
import cn.jisol.ngame.room.defalut.DefaultNRoom;
import cn.jisol.ngame.socket.websocket.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.socket.websocket.encoders.DefaultProtoBufEncoder;
import com.google.protobuf.Any;
import com.google.protobuf.InvalidProtocolBufferException;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ServerEndpoint(
    value = "/game/{roomId}",
    encoders = {DefaultProtoBufEncoder.class},
    decoders = {DefaultProtoBufDecoder.class}
)
@Controller
public class GameWebSocket {

    public static final Map<String, DefaultNRoom> ROOMS = new HashMap<>();

    @OnOpen
    public void onOpen(Session session){

        String uuid = session.getPathParameters().get("roomId");
        DefaultNRoom room = ROOMS.get(uuid);

        if(Objects.isNull(room)){
            //创建一个房间
            room = new DefaultNRoom(uuid);
            ROOMS.put(room.getUuid(),room);
        }

        room.addClient(new DefaultNClient(session));

    }

    @OnMessage
    public void onMessage(Session session,NGameMessage message){
        //找到用户

        String uuid = session.getPathParameters().get("roomId");
        if(Objects.nonNull(ROOMS.get(uuid))){
            ROOMS.get(uuid).getClients().forEach(
                client -> {
                    if(client.getUuid().equals(session.getId()))
                        client.onMessage(message);
                }
            );
        }

    }

    @OnClose
    public void onClose(Session session){

    }

    @OnError
    public void onError(Session session, Throwable t){
        t.printStackTrace();
    }

}
