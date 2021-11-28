package cn.jisol.ngame.netty.network.udp;

import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import cn.jisol.ngame.netty.network.udp.decoders.DefaultUDPDecoder;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.handler.codec.MessageToByteEncoder;
import io.netty.handler.codec.MessageToMessageDecoder;

import java.nio.charset.StandardCharsets;
import java.util.List;

public class UDPInitializer extends ChannelInitializer<NioDatagramChannel> {

    private UDPJNettyNetwork ngame;

    public UDPInitializer(UDPJNettyNetwork ngame){
        this.ngame = ngame;
    }

    @Override
    protected void initChannel(NioDatagramChannel channel) throws Exception {
        //添加解码器
        channel.pipeline().addLast(new DefaultUDPDecoder());

        for (ChannelHandler decoder : ngame.getDecoders()) {
            channel.pipeline().addLast(decoder);
        }

        channel.pipeline().addLast(new UDPBusiness(this.ngame));

        //添加发送编码器
        for (ChannelHandler encoder : ngame.getEncoders()) {
            channel.pipeline().addLast(encoder);
        }

    }

}
