package cn.jisol.ngame.netty.network;

import cn.jisol.ngame.netty.JNettyApplication;
import cn.jisol.ngame.netty.network.udp.UDPInitializer;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelOption;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.handler.codec.MessageToByteEncoder;
import io.netty.handler.codec.MessageToMessageDecoder;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UDPJNettyNetwork extends JNettyNetwork {

    private int port;
    private MessageToMessageDecoder[] decoders;
    private MessageToByteEncoder[] encoders;

     /**
     * 启动UDP服务
     * @return
     */
    @Override
    public boolean start(JNettyApplication application) {

        this.port = application.getPort();
        this.decoders = application.getDecoders().toArray(new MessageToMessageDecoder[0]);

        //启动Netty UDP
        //配置事件<消费>管理者
        NioEventLoopGroup group = new NioEventLoopGroup();
        //配置启动器
        Bootstrap bootstrap = new Bootstrap();
        bootstrap.group(group)
                .channel(NioDatagramChannel.class) //UDP管道
                .option(ChannelOption.SO_BROADCAST,true) //指定为广播模式 多人
                .handler(new UDPInitializer(this));

        //开启服务
        try {
            Channel channel = bootstrap.bind(this.port).sync().channel();
            System.out.println(String.format("启动UDP服务器成功 : [%s]",this.port));
            (new Thread(() -> {
                //等待结束
                try {
                    channel.closeFuture().sync();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    group.shutdownGracefully();
//                    this.clone(channel);
                }
            })).start();
        } catch (Exception ignored) { return false; }

        return true;
    }


}
