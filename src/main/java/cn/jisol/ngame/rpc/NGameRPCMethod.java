package cn.jisol.ngame.rpc;

import cn.jisol.ngame.rpc.mode.NRPCMode;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 声明 RPC 方法
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface NGameRPCMethod {

    NRPCMode mode() default NRPCMode.DEFAULT;

}
