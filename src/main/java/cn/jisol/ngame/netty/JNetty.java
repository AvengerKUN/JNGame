package cn.jisol.ngame.netty;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.netty.network.JNettyNetwork;
import io.netty.channel.Channel;

/**
 * JNetty 必要启动class
 */
public abstract class JNetty<T extends JNettyNetwork> {

    private T network = null;

    //启动
    public boolean start(){

        //获取JNetty 网络类型 并且 实例化
        this.network = this.initNetty();
        this.network.setNetty(this);
        return this.network.start();

    }

    public abstract T initNetty();

    public void close(Channel channel){};

}
