package cn.jisol.ngame.network.netty.udp.decoders;

import cn.jisol.ngame.netty.network.udp.coder.JNByteToMessageDecoder;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;

import java.nio.charset.StandardCharsets;

public class DefaultProtoBufDecoder extends JNByteToMessageDecoder<String> {
    @Override
    public String nDecoder(ChannelHandlerContext channelHandlerContext, ByteBuf data) {
        return data.toString(StandardCharsets.UTF_8);
    }
}
