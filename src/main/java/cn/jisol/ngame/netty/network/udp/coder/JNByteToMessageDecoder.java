package cn.jisol.ngame.netty.network.udp.coder;

import cn.jisol.ngame.netty.network.coder.JNMessageToMessageDecoder;
import cn.jisol.ngame.netty.network.udp.entity.UDPReceiveMessage;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;

import java.util.List;

public abstract class JNByteToMessageDecoder<R> extends JNMessageToMessageDecoder<ByteBuf,R, UDPReceiveMessage> {
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, UDPReceiveMessage message, List<Object> list) throws Exception {
        message.addMessage(this.nDecoder(channelHandlerContext,message.vData(ByteBuf.class)));
        list.add(message);
    }
}
