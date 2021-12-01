package cn.jisol.ngame.network.netty.udp;


import cn.jisol.ngame.client.nclient.UDPClient;
import cn.jisol.ngame.netty.annotation.AJNetty;
import cn.jisol.ngame.netty.annotation.control.JNClose;
import cn.jisol.ngame.netty.annotation.control.JNInit;
import cn.jisol.ngame.netty.annotation.control.JNMessage;
import cn.jisol.ngame.netty.annotation.control.JNOpen;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import cn.jisol.ngame.netty.network.udp.session.UDPSessionGroup;
import cn.jisol.ngame.network.netty.udp.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.network.netty.udp.encoders.DefaultProtoBufEncoder;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.room.defalut.DefaultNRoom;

import java.util.HashMap;
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
public class GameUDPServer {

    public static final Map<String, UDPClient> CLIENTS = new ConcurrentHashMap<>();

    @JNInit
    public void initNetwork(UDPJNettyNetwork network){
        System.out.println("initNetwork");

        //因UDP协议无法监听客户端是否在线 所以导致 onClose失效 这里需要吧心跳开启
        network.setOpenAlive(true);
        network.setVAliveTime(2000);
        network.setVAliveError(1000);
    }

    @JNOpen
    public void onOpen(UDPSession session,UDPSessionGroup clients){
        //将session添加到Clients中
        CLIENTS.put(session.getSid(),new UDPClient(session));
        System.out.println(String.format("【%s】连接服务器 - 当前服务器在线人数:%s",session.getSid(),clients.size()));
    }

    @JNMessage
    public void onMessage(UDPSession session,UDPSessionGroup clients, NGameMessage message,String text){
        //查询clients中的client
        UDPClient client = null;
        if(Objects.isNull(client = CLIENTS.get(session.getSid()))) this.onOpen(session,clients);

        //统一发送到客户端的onMessage中
        client.onMessage(message);

        System.out.println(String.format("【%s】接收到消息UID:%s",session.getSid(),message.getUid()));
        session.vSendMessage(message);
    }

    @JNClose
    public void onClose(UDPSession session,UDPSessionGroup clients){
        //移除Client
        CLIENTS.remove(session.getSid());
        System.out.println(String.format("【%s】离开服务器 - 当前服务器在线人数:%s",session.getSid(),clients.size()));
    }
}
