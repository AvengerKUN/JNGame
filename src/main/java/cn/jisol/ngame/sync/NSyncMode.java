package cn.jisol.ngame.sync;

import cn.jisol.ngame.ncall.NCall;

/**
 * 同步模式
 */
public interface NSyncMode extends NCall {

    //开始同步
    public void start();

    //结束同步
    public void end();

}
