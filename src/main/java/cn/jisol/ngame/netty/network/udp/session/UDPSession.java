package cn.jisol.ngame.netty.network.udp.session;

import cn.jisol.ngame.netty.network.udp.entity.UDPSendMessage;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.socket.DatagramPacket;
import lombok.Getter;
import lombok.Setter;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
public class UDPSession {

    private String cId; //客户端ID
    private String sId; //服务器ID
    private List<Object> messages;
    private Channel server;
    private InetSocketAddress address;
    //是否活跃
    private Boolean isAlive;

    //最后发送消息的时间
    public Date lastAliveTime;

    public UDPSession(String sId,String cId,Channel server, InetSocketAddress address){
        this.sId = sId;
        this.cId = cId;
        this.server = server;
        this.address = address;
        this.messages = new ArrayList<>();
        this.isAlive = true;
    }

    /**
     * 发送消息
     * @param msg
     */
    public void vSendMessage(Object msg) {

        ByteBuf buf = null;

        //服务器向客户端发送消息
        server.writeAndFlush(
                UDPSendMessage.builder()
                    .sender(this)
                    .message(msg)
                .build()
        );
    }
}
