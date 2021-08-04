package cn.jisol.ngame.listener;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.hutool.core.util.ClassUtil;
import cn.jisol.ngame.rpc.NGameRPC;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.ReadinessState;
import org.springframework.context.ApplicationListener;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Repository;

import java.lang.reflect.Method;
import java.util.*;

@Repository
public class InitNGameRPCListener implements ApplicationListener<AvailabilityChangeEvent> {
    @Override
    public void onApplicationEvent(AvailabilityChangeEvent event) {
        if (ReadinessState.ACCEPTING_TRAFFIC != event.getState()) return;

        System.out.println("--- 初始化 --- NGameRPC ---");

        Set<Class<?>> classes = ClassUtil.scanPackage("cn.jisol.ngame");

        classes.forEach((Class<?> value) -> {
            if(Objects.nonNull(AnnotationUtil.getAnnotation(value, NGameRPCClass.class))){
                for (Method method : value.getMethods()){
                    if (Objects.nonNull(AnnotationUtils.findAnnotation(method, NGameRPCMethod.class)))
                        NGameRPC.addRPCMethod(value,method);
                }
            }
        });

        System.out.println(String.format("扫描到RPC Class数量:%s",NGameRPC.lClassSize()));

    }
}
