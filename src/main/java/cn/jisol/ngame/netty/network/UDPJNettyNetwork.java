package cn.jisol.ngame.netty.network;

import cn.hutool.core.date.DateTime;
import cn.jisol.ngame.netty.JNettyApplication;
import cn.jisol.ngame.netty.annotation.control.JNClose;
import cn.jisol.ngame.netty.network.coder.JNMessageToMessageDecoder;
import cn.jisol.ngame.netty.network.coder.JNMessageToMessageEncoder;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import cn.jisol.ngame.netty.network.udp.session.UDPSessionGroup;
import cn.jisol.ngame.netty.network.udp.UDPInitializer;
import cn.jisol.ngame.util.JAnnotationUtil;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelOption;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioDatagramChannel;
import io.netty.handler.codec.MessageToByteEncoder;
import io.netty.handler.codec.MessageToMessageDecoder;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Method;
import java.util.Date;


@Getter
@Setter
public class UDPJNettyNetwork extends JNettyNetwork {

    private int port;
    private JNMessageToMessageDecoder[] decoders;
    private JNMessageToMessageEncoder[] encoders;
    private JNettyApplication application;
    private final UDPSessionGroup clients = new UDPSessionGroup();

    //是否开启活跃检测
    private boolean isOpenAlive = false;
    private int vAliveTime = 1000;
    private int vAliveError = 500;

    /**
     * 启动UDP服务
     * @return
     */
    @Override
    public boolean start(JNettyApplication application) {

        this.application = application;
        this.port = application.getPort();
        this.decoders = application.getDecoders().toArray(new JNMessageToMessageDecoder[0]);
        this.encoders = application.getEncoders().toArray(new JNMessageToMessageEncoder[0]);

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
            //初始化
            this.init();
            System.out.println(String.format("启动UDP服务器成功 : [%s]",this.port));
            (new Thread(() -> {
                //等待结束
                try {
                    channel.closeFuture().sync();
                } catch (Exception ignored) {} finally {
                    group.shutdownGracefully();
                }
            })).start();
        } catch (Exception ignored) { return false; }

        return true;
    }

    public void init(){
        this.rOpenAlive();
    }

    //活跃检测
    public void rOpenAlive(){

        (new Thread(() ->{

            //检测最后活跃时间是否大于活跃限制
            while (this.isOpenAlive){

                for (UDPSession value : clients.values()) {
                    long crTime = DateTime.now().getTime();
                    long erTime = ((this.vAliveTime+this.vAliveError));

                    if(value.lastAliveTime.getTime() + erTime < crTime ){
                        //设置不活跃
                        value.setIsAlive(false);
                        //超出最大活跃时间(踢出组 并且通知 )
                        clients.remove(value.getCId());
                        //找到JNClose注解
                        for (Method method : JAnnotationUtil.findMethods(application.getController().getClass().getMethods(), JNClose.class)) {
                            JAnnotationUtil.vRunMethod(application.getController(),method,new Object[]{
                                    value,clients
                            });
                        }
                    }
                }

                try {
                    Thread.sleep(this.vAliveTime);
                } catch (InterruptedException ignored) {}
            }

        })).start();

    }
}
