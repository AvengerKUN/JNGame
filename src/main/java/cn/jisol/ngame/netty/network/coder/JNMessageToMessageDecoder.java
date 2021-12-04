package cn.jisol.ngame.netty.network.coder;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToMessageDecoder;

public abstract class JNMessageToMessageDecoder<P,R,A> extends MessageToMessageDecoder<A> {

    public abstract R nDecoder(ChannelHandlerContext channelHandlerContext,P data);

}
