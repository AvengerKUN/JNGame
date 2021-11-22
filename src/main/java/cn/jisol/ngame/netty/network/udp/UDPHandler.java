package cn.jisol.ngame.netty.network.udp;

import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.handler.codec.MessageToMessageDecoder;

import java.util.List;

public class UDPHandler extends ChannelInitializer<NioDatagramChannel> {

    @Override
    protected void initChannel(NioDatagramChannel channel) throws Exception {
        channel.pipeline().addLast(new UDPDecoder()); //添加解码器
        channel.pipeline().addLast(new UDPBusinessHandler());
    }

    public static class UDPDecoder extends MessageToMessageDecoder<DatagramPacket>{

        @Override
        protected void decode(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket, List<Object> list) throws Exception {

            list.add("你好");

        }

    }
}
