package cn.jisol.ngame.demo.network.websocket.game;


import cn.jisol.ngame.client.NClient;
import cn.jisol.ngame.demo.client.CocosFrameNClient;
import cn.jisol.ngame.demo.client.cocos_bridge.CocosBridgeClient;
import cn.jisol.ngame.demo.client.cocos_bridge.CocosBridgeServer;
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
 * Cocos 桥接同步的测试Socket类
 * type : client 客户端 server 服务端
 * uuid : 唯一ID
 */
@ServerEndpoint(
        value = "/game/cocos/bridge/{type}/{uuid}",
        encoders = {DefaultProtoBufEncoder.class},
        decoders = {DefaultProtoBufDecoder.class}
)
@Controller
public class CocosBridgeWebSocket {

    //服务端列表
    public static final Map<String, CocosBridgeServer> SERVERS = new ConcurrentHashMap<>();

    //客户端列表
    public static final Map<String, CocosBridgeClient> CLIENTS = new ConcurrentHashMap<>();


    @OnOpen
    public void onOpen(Session session){

        String uuid = session.getPathParameters().get("uuid");
        String type = session.getPathParameters().get("type");


        if(Objects.isNull(CLIENTS.get(uuid))){

            //加入游戏
            NClient client = null;

            switch (type){
                //客户端加入了桥接
                case "client":
                    client = new CocosBridgeClient(uuid,session);
                    System.out.println(String.format("%s 客户端 连接 Cocos 状态同步(桥接)",client.getUuid()));
                    CLIENTS.put(uuid, (CocosBridgeClient) client);
                    break;
                //服务端加入了桥接
                case "server":
                    client = new CocosBridgeServer(uuid,session);
                    System.out.println(String.format("%s 服务端 连接 Cocos 状态同步(桥接)",client.getUuid()));
                    SERVERS.put(uuid, (CocosBridgeServer) client);
                    break;
            }

        }

    }

    @OnMessage
    public void onMessage(Session session, NGameMessageOuterClass.NGameMessage message){

        String uuid = session.getPathParameters().get("uuid");

        //找到用户
        NClient client = null;
        if(Objects.nonNull(client = CLIENTS.get(uuid)) || Objects.nonNull(client = SERVERS.get(uuid))){
            //调用客户端消息统一接收
            client.onMessage(message);
        }

    }


    @OnClose
    public void onClose(Session session){

        //断开连接
        String uuid = session.getPathParameters().get("uuid");
        String type = session.getPathParameters().get("type");

        switch (type){
            case "client":
                CocosBridgeClient client = CLIENTS.get(uuid);
                if(Objects.nonNull(client)){
                    //删除玩家
                    CLIENTS.remove(uuid);
                    //退出服务器
                    client.nExitServer();
                }
                break;
            case "server":
                CocosBridgeServer server = SERVERS.get(uuid);
                if(Objects.nonNull(server)){
                    //删除客户端
                    SERVERS.remove(uuid);
                }
                break;
        }

    }

    @OnError
    public void onError(Session session, Throwable t){

    }

}
