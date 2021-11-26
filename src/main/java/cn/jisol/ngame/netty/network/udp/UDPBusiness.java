package cn.jisol.ngame.netty.network.udp;

import cn.jisol.ngame.netty.network.session.UDPSession;
import io.netty.buffer.ByteBuf;
import io.netty.channel.ChannelHandlerAdapter;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

public class UDPBusiness extends SimpleChannelInboundHandler<UDPSession> {
    public UDPBusiness(){
        super(false);
    }

    @Override
    protected void messageReceived(ChannelHandlerContext channelHandlerContext, UDPSession udpSession) {
        System.out.println(udpSession.vData(String.class));;
    }

}
