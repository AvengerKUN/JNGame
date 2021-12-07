package cn.jisol.ngame.demo.network.netty.udp.decoders;

import cn.jisol.ngame.netty.network.udp.coder.JNByteToMessageDecoder;
import cn.jisol.ngame.demo.proto.message.NGameMessageOuterClass.*;
import com.google.protobuf.InvalidProtocolBufferException;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerContext;

public class DefaultProtoBufDecoder extends JNByteToMessageDecoder<NGameMessage> {
    @Override
    public NGameMessage nDecoder(ChannelHandlerContext channelHandlerContext, ByteBuf data) {
        try {
            return NGameMessage.parseFrom(data.array());
        } catch (InvalidProtocolBufferException e) {
            return NGameMessage.newBuilder().build();
        }
    }
}
