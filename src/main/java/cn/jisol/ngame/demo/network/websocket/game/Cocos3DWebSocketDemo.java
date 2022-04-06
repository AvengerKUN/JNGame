package cn.jisol.ngame.demo.network.websocket.game;

import cn.jisol.ngame.demo.client.CocosFrameNClient;
import cn.jisol.ngame.demo.client.cocos_3d_demo.Cocos3DClient;
import cn.jisol.ngame.demo.client.cocos_bridge.CocosBridgeClient;
import cn.jisol.ngame.demo.entity.cocos.demo.IDInfo;
import cn.jisol.ngame.demo.game.action.cocos.ddemo.service.SNCocos3DDemoAction;
import cn.jisol.ngame.demo.game.action.cocos.frame.service.SNCocosFrameAction;
import cn.jisol.ngame.demo.network.websocket.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.demo.network.websocket.encoders.DefaultProtoBufEncoder;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.util.spring.SpringBeanUtils;
import org.springframework.stereotype.Controller;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Cocos 3D 游戏 状态帧同步Demo
 * uuid : 唯一ID
 */
@ServerEndpoint(
        value = "/game/cocos/3d/demo/{uuid}",
        encoders = {DefaultProtoBufEncoder.class},
        decoders = {DefaultProtoBufDecoder.class}
)
@Controller
public class Cocos3DWebSocketDemo {

    //客户端列表
    public static final Map<String, Cocos3DClient> CLIENTS = new ConcurrentHashMap<>();

    public static SNCocos3DDemoAction SN_CocosFrameAction;

    @OnOpen
    public void onOpen(Session session){

        String uuid = session.getPathParameters().get("uuid");

        //如果是第一个玩家加入游戏则开启同步
        if (CLIENTS.values().size() <= 0){

            SN_CocosFrameAction = SpringBeanUtils.getBean(SNCocos3DDemoAction.class);
            SN_CocosFrameAction.clients = CLIENTS;
            SN_CocosFrameAction.nGameSyncStart();

        }

        //创建客户端对象
        Cocos3DClient client = null;

        if(Objects.isNull(CLIENTS.get(uuid))){
            client = new Cocos3DClient(uuid,session);
            System.out.println(String.format("%s 连接 Cocos 3D 状态帧同步 WebSocket服务器成功",client.getUuid()));

            //通知其他玩家
            CLIENTS.values().forEach(value -> {
                value.getCnCocos3DDemoAction().nJoinGame();
            });

            CLIENTS.put(uuid,client);

        }

    }

    @OnMessage
    public void onMessage(Session session, NGameMessageOuterClass.NGameMessage message){

        String uuid = session.getPathParameters().get("uuid");

        //找到用户
        Cocos3DClient client = null;
        if(Objects.nonNull(client = CLIENTS.get(uuid))){
            //调用客户端消息统一接收
            client.onMessage(message);
        }

    }

    @OnClose
    public synchronized void onClose(Session session){

        String uuid = session.getPathParameters().get("uuid");

        Cocos3DClient client = null;

        if(Objects.nonNull(client = CLIENTS.get(uuid))){

            CLIENTS.remove(uuid);

            //删除的Id 和 更新的Id
            List<Long> deleteIds = new ArrayList<>();

            Cocos3DClient finalClient = client;

            SN_CocosFrameAction.ids.values().forEach(idInfo -> {
                if (idInfo.getClient().getUuid().equals(finalClient.getUuid())){

                    if(idInfo.getType().equals(IDInfo.IDEnum.Local)){
                        //如果是本地则删除
                        deleteIds.add(idInfo.getNId());
                    }else if(idInfo.getType().equals(IDInfo.IDEnum.World)){
                        //如果是世界则将权限转让 随机转让其他人

                        String[] keys = CLIENTS.keySet().toArray(new String[0]);

                        if(keys.length > 0){
                            idInfo.setClient(CLIENTS.get(keys[(new Random().nextInt(keys.length))]));
                            SN_CocosFrameAction.nUpdateID(idInfo);
                        }

                    }

                }
            });

            SN_CocosFrameAction.nDeleteIds(deleteIds);

        }


    }

    @OnError
    public void onError(Session session, Throwable t){

    }


}
