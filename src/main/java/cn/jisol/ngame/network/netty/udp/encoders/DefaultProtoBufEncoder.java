package cn.jisol.ngame.network.netty.udp.encoders;

import cn.jisol.ngame.netty.network.udp.coder.JNMessageToByteEncoder;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.util.CharsetUtil;

public class DefaultProtoBufEncoder extends JNMessageToByteEncoder<String> {

    @Override
    public ByteBuf nEncoder(ChannelHandlerContext channelHandlerContext, String data) {
        return Unpooled.copiedBuffer(data , CharsetUtil.UTF_8);
    }

}
