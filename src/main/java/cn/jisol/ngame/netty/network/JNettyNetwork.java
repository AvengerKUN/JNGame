package cn.jisol.ngame.netty.network;

import cn.jisol.ngame.netty.JNettyApplication;

public abstract class JNettyNetwork {

    /**
     * 启动服务
     */
    public abstract boolean start(JNettyApplication application);

}
