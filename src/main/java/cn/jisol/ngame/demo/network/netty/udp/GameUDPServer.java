package cn.jisol.ngame.demo.network.netty.udp;


import cn.jisol.ngame.client.nclient.UDPClient;
import cn.jisol.ngame.demo.game.action.nudp.service.SNGameUDPAction;
import cn.jisol.ngame.netty.annotation.AJNetty;
import cn.jisol.ngame.netty.annotation.control.*;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import cn.jisol.ngame.netty.network.udp.session.UDPSessionGroup;
import cn.jisol.ngame.demo.network.netty.udp.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.demo.network.netty.udp.encoders.DefaultProtoBufEncoder;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 启动Netty UDP
 */
@AJNetty(
    port = 1000,
    network = UDPJNettyNetwork.class,
    decoders = {
        DefaultProtoBufDecoder.class
    },
    encoders = {
        DefaultProtoBufEncoder.class
    }
)
@Component
public class GameUDPServer {

    @Autowired
    SNGameUDPAction sNGameUDPAction;

    //客户端列表
    public final Map<String, UDPClient> CLIENTS = new ConcurrentHashMap<>();

    /**
     * 初始化开始 - 用于修改Network信息
     */
    @JNInit
    public void initNetwork(UDPJNettyNetwork network){
        //因UDP协议无法监听客户端是否在线 所以导致 onClose失效 这里需要吧心跳开启
        network.setOpenAlive(true);
        network.setVAliveTime(20000);
        network.setVAliveError(10000);
    }

    /**
     * 初始化成功
     */
    @JNInitSuccess
    public void initNetworkSuccess(UDPJNettyNetwork network){

        String sid = network.getSid();

        //将Clients 赋值给 SNGameUDPAction
        sNGameUDPAction.getRooms().put(sid,this.CLIENTS);

    }

    @JNOpen
    public void onOpen(UDPSession session,UDPSessionGroup clients){
        //将session添加到Clients中
        CLIENTS.put(session.getCId(),new UDPClient(session));
        System.out.println(String.format("【%s】连接服务器 - 当前服务器在线人数:%s",session.getCId(),clients.size()));
    }

    @JNMessage
    public void onMessage(UDPSession session,UDPSessionGroup clients, NGameMessage message,String text){
        //查询clients中的client
        UDPClient client = null;
        if(Objects.isNull(client = CLIENTS.get(session.getCId()))) this.onOpen(session,clients);

        System.out.println(String.format("【%s】接收到消息UID:%s action:%s event:%s",session.getCId(),message.getUid(),message.getAction(),message.getEvent()));

        //统一发送到客户端的onMessage中
        client.onMessage(message);

//        session.vSendMessage(message);
    }

    @JNClose
    public void onClose(UDPSession session,UDPSessionGroup clients){
        //移除Client
        CLIENTS.remove(session.getCId());
        System.out.println(String.format("【%s】离开服务器 - 当前服务器在线人数:%s",session.getCId(),clients.size()));
    }
}
