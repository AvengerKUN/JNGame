package cn.jisol.ngame.demo.network.netty.udp.encoders;

import cn.jisol.ngame.netty.network.udp.coder.JNMessageToByteEncoder;
import com.google.protobuf.AbstractMessage;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;

public class DefaultProtoBufEncoder extends JNMessageToByteEncoder<AbstractMessage> {
    @Override
    public ByteBuf nEncoder(ChannelHandlerContext channelHandlerContext, AbstractMessage data) {
        return Unpooled.copiedBuffer(data.toByteArray());
    }
}
