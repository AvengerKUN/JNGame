package cn.jisol.ngame.netty.network.coder;

import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToMessageEncoder;

public abstract class JNMessageToMessageEncoder<P,R,A> extends MessageToMessageEncoder<A> {

    public abstract R nEncoder(ChannelHandlerContext channelHandlerContext, P data);

}
