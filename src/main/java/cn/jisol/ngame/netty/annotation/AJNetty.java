package cn.jisol.ngame.netty.annotation;

import cn.jisol.ngame.netty.network.JNettyNetwork;
import cn.jisol.ngame.netty.network.coder.JNMessageToMessageDecoder;
import cn.jisol.ngame.netty.network.coder.JNMessageToMessageEncoder;
import io.netty.handler.codec.MessageToByteEncoder;
import io.netty.handler.codec.MessageToMessageDecoder;

import javax.websocket.Encoder;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.List;

/**
 * 启动Netty服务注解
 * value ：协议类型
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface AJNetty {
    //端口
    int port();
    //网络
    Class<? extends JNettyNetwork> network();
    //解码器
    Class<? extends JNMessageToMessageDecoder>[] decoders() default {};
    //编码器
    Class<? extends JNMessageToMessageEncoder>[] encoders() default {};
}
