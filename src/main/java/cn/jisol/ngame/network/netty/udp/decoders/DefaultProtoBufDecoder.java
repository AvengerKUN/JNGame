package cn.jisol.ngame.network.netty.udp.decoders;

import cn.jisol.ngame.netty.network.session.UDPSession;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.socket.DatagramPacket;
import io.netty.handler.codec.MessageToMessageDecoder;

import java.nio.charset.StandardCharsets;
import java.util.List;

public class DefaultProtoBufDecoder extends MessageToMessageDecoder<UDPSession> {
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, UDPSession message, List<Object> list) throws Exception {
        message.addMessage(message.vData(ByteBuf.class).toString(StandardCharsets.UTF_8));
        list.add(message);
    }
}
