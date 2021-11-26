package cn.jisol.ngame.netty;

import cn.jisol.ngame.netty.network.JNettyNetwork;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 启动Netty服务注解
 * value ：协议类型
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface AJNetty {

}
