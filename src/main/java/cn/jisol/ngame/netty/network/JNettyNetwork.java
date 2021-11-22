package cn.jisol.ngame.netty.network;

import cn.jisol.ngame.netty.JNetty;
import io.netty.channel.Channel;

public abstract class JNettyNetwork {
    private JNetty netty;

    public void setNetty(JNetty netty) {
        this.netty = netty;
    }

    /**
     * 启动服务
     */
    public abstract boolean start();

    /**
     * 监听关闭服务
     */
    public void clone(Channel channel){
        netty.close(channel);
    };
}
