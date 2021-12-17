package cn.jisol.ngame.demo.network.websocket.game;

import cn.jisol.ngame.demo.client.CocosFrameNClient;
import cn.jisol.ngame.demo.client.CocosNClient;
import cn.jisol.ngame.demo.game.action.cocos.frame.service.SNCocosFrameAction;
import cn.jisol.ngame.demo.network.websocket.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.demo.network.websocket.encoders.DefaultProtoBufEncoder;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.spring.SpringBeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
    public static final Map<String, CocosFrameNClient> CLIENTS = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session){

        String uuid = session.getPathParameters().get("uuid");

        //如果是第一个玩家加入游戏则开启同步
        if (CLIENTS.values().size() <= 0){
            SNCocosFrameAction snCocosFrameAction = SpringBeanUtils.getBean(SNCocosFrameAction.class);
            snCocosFrameAction.clients = CLIENTS;
            snCocosFrameAction.nGameSyncStart();
        }


        //创建客户端对象
        CocosFrameNClient client = null;

        if(Objects.isNull(CLIENTS.get(uuid))){
            client = new CocosFrameNClient(uuid,session);
            System.out.println(String.format("%s 连接 Cocos 帧同步 WebSocket服务器成功",client.getUuid()));
            CLIENTS.put(uuid,client);
        }

    }

    @OnMessage
    public void onMessage(Session session, NGameMessageOuterClass.NGameMessage message){

        String uuid = session.getPathParameters().get("uuid");

        //找到用户
        CocosFrameNClient client = null;
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
