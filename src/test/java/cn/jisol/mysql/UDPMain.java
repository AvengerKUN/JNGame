package cn.jisol.mysql;

import io.netty.bootstrap.Bootstrap;
import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.DatagramPacket;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.util.CharsetUtil;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class UDPMain {
    public static void main(String[] args) {
        EventLoopGroup group=new NioEventLoopGroup();
        try
        {
            Bootstrap b=new Bootstrap();
            b.group(group)
                    .channel(NioDatagramChannel.class)
                    .option(ChannelOption.SO_BROADCAST, true)
                    .handler(new SimpleChannelInboundHandler<DatagramPacket>() {
                        @Override
                        protected void messageReceived(ChannelHandlerContext channelHandlerContext, DatagramPacket datagramPacket) throws Exception {

                        }
                    });
            Channel ch = b.bind(0).sync().channel();
            //向网段内的所有机器广播
            ch.writeAndFlush(new DatagramPacket(Unpooled.copiedBuffer(
                    "谚语字典查询?", CharsetUtil.UTF_8), new InetSocketAddress(
                    "127.0.0.1",1000))).sync();
            //客户端等待15s用于接收服务端的应答消息，然后退出并释放资源
//            if(!ch.closeFuture().await(15000)){
//                System.out.println("查询超时！");
//            }
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }finally{
            group.shutdownGracefully();
        }
    }
}
