package cn.jisol.ngame.network.netty.udp.encoders;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

import java.net.DatagramPacket;
import java.nio.charset.StandardCharsets;

public class DefaultProtoBufEncoder extends MessageToByteEncoder<String> {
    @Override
    protected void encode(ChannelHandlerContext channelHandlerContext, String message, ByteBuf out) throws Exception {
        System.out.println("MessageToByteEncoder");
//        this.write(channelHandlerContext,new DatagramPacket(Unpooled.copiedBuffer(message.getBytes(StandardCharsets.UTF_8))));
    }
}
