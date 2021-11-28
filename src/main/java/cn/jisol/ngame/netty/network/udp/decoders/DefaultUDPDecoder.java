package cn.jisol.ngame.netty.network.udp.decoders;

import cn.jisol.ngame.netty.network.udp.entity.UDPReceiveMessage;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import io.netty.buffer.ByteBuf;
import io.netty.channel.Channel;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.socket.DatagramPacket;
import io.netty.handler.codec.MessageToMessageDecoder;

import java.util.ArrayList;
import java.util.List;

public class DefaultUDPDecoder extends MessageToMessageDecoder<DatagramPacket> {

    @Override
    protected void decode(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket, List<Object> list) {

        list.add(toMessage(channelHandlerContext.channel(),datagramPacket));
    }

    private UDPReceiveMessage toMessage(Channel channel, DatagramPacket data){

        String sid = String.format("%s-%s-%s-%s",
            data.recipient().getAddress(),data.recipient().getPort(),
            data.sender().getAddress(),data.sender().getPort()
        );

        UDPReceiveMessage message = UDPReceiveMessage.builder()
                .receive(new UDPSession(sid, channel, data.sender()))
                .messages(new ArrayList<>())
                .build();
        ByteBuf in = data.content();
        ByteBuf byteBuf = in.readBytes(in.readableBytes());
        message.addMessage(byteBuf);

        return message;

    }
}
