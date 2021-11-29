package cn.jisol.ngame.network.netty.udp;


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
        System.out.println(String.format("【%s】连接服务器 - 当前服务器在线人数:%s",session.getSid(),clients.size()));
    }

    @JNMessage
    public void onMessage(UDPSession session,String text){
        System.out.println(text);
        session.vSendMessage("你好");
    }

    @JNClose
    public void onClose(UDPSession session,UDPSessionGroup clients){
        System.out.println(String.format("【%s】离开服务器 - 当前服务器在线人数:%s",session.getSid(),clients.size()));
    }
}
