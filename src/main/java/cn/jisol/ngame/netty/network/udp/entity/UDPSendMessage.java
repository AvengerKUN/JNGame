package cn.jisol.ngame.netty.network.udp.entity;

import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import io.netty.buffer.ByteBuf;
import io.netty.channel.socket.DatagramPacket;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

/**
 * 用于发送消息的对象
 */
@Getter
@Setter
@Builder
public class UDPSendMessage {

    private UDPSession sender; //接收者
    private Object message;//发送消息

    /**
     * 发送消息
     */
    public boolean vSend(ByteBuf message){
        if(Objects.isNull(message)) return false;

        sender.getServer().writeAndFlush(new DatagramPacket(message,sender.getAddress()));
        return true;
    }

}
