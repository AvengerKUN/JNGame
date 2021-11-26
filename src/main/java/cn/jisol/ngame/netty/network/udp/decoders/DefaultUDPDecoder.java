package cn.jisol.ngame.netty.network.udp.decoders;

import cn.jisol.ngame.netty.network.session.UDPSession;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.socket.DatagramPacket;
import io.netty.handler.codec.MessageToMessageDecoder;

import java.util.List;

public class DefaultUDPDecoder extends MessageToMessageDecoder<DatagramPacket> {
    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket, List<Object> list) {
        UDPSession session = new UDPSession(datagramPacket);

        ByteBuf in = datagramPacket.content();
        ByteBuf byteBuf = in.readBytes(in.readableBytes());
        session.addMessage(byteBuf);

        list.add(session);
    }
}
