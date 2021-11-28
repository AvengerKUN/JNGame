package cn.jisol.ngame.netty.network.udp.coder;

import cn.jisol.ngame.netty.network.coder.JNMessageToMessageEncoder;
import cn.jisol.ngame.netty.network.udp.entity.UDPSendMessage;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;

public abstract class JNMessageToByteEncoder<P> extends JNMessageToMessageEncoder<P, ByteBuf, UDPSendMessage> {

    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, UDPSendMessage message, List<Object> list) throws Exception {
        try{
            P value = (P) message.getMessage();
            message.vSend(this.nEncoder(channelHandlerContext, value));
        }finally {
            list.add(message);
        }
    }
}
