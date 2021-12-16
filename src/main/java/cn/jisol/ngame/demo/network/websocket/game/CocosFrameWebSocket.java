package cn.jisol.ngame.demo.network.websocket.game;

import cn.jisol.ngame.client.nclient.SocketNClient;
import cn.jisol.ngame.demo.network.websocket.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.demo.network.websocket.encoders.DefaultProtoBufEncoder;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;


/**
 * Cocos 帧同步的测试Socket类
 */
@ServerEndpoint(
    value = "/game/cocos/frame/{uuid}",
    encoders = {DefaultProtoBufEncoder.class},
    decoders = {DefaultProtoBufDecoder.class}
)
@Controller
public class CocosFrameWebSocket {

    //客户端列表
    public static final Map<String, SocketNClient> CLIENTS = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session){

        String uuid = session.getPathParameters().get("uuid");

        //创建客户端对象
        SocketNClient client = null;

        if(Objects.isNull(CLIENTS.get(uuid))){
            client = new SocketNClient(uuid,session);
            System.out.println(String.format("%s 连接 Cocos 帧同步 WebSocket服务器成功",client.getUuid()));
            CLIENTS.put(uuid,client);
        }

    }

    @OnMessage
    public void onMessage(Session session, NGameMessageOuterClass.NGameMessage message){

        String uuid = session.getPathParameters().get("uuid");

        //找到用户
        SocketNClient client = null;
        if(Objects.nonNull(client = CLIENTS.get(uuid))){
            //调用客户端消息统一接收
            client.onMessage(message);
        }

    }

    @OnClose
    public void onClose(Session session){
        String uuid = session.getPathParameters().get("uuid");
        CLIENTS.remove(uuid);
    }

    @OnError
    public void onError(Session session, Throwable t){

    }


}
