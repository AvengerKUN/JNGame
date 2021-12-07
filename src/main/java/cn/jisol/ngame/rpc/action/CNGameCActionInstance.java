package cn.jisol.ngame.rpc.action;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.hutool.json.JSONUtil;
import cn.jisol.ngame.client.NClient;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import com.google.protobuf.Any;
import com.google.protobuf.ByteString;
import com.google.protobuf.Message;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.Objects;

public class CNGameCActionInstance {

    public static Object newInstance(NClient client,Class<?> vClass){

        if (Objects.isNull(AnnotationUtil.getAnnotation(vClass, NGameRPCClass.class))) return null;

        return Proxy.newProxyInstance(vClass.getClassLoader(), new Class<?>[]{vClass}, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

                NGameRPCMethod nGameRPCMethod = null;

                if (Objects.isNull(nGameRPCMethod = AnnotationUtil.getAnnotation(method, NGameRPCMethod.class))) return proxy;

                Any message = null;

                if(Objects.isNull(args)) args = new Object[0];

                if (args.length == 1) {
                    //判断是否是Any类型
                    if(args[0] instanceof Message){
                        message = Any.pack(((Message)args[0]));
                    }
                }

                if(Objects.isNull(message)){
                    message = Any.newBuilder().setValue(ByteString.copyFromUtf8(JSONUtil.toJsonStr(args))).build();
                }

                switch (nGameRPCMethod.mode()){
                    case UID:
                        NUIDMode nUIDMode = null;
                        if(Objects.isNull(nUIDMode = AnnotationUtil.getAnnotation(method, NUIDMode.class))) break;
                        client.onSend(
                            NGameMessage.newBuilder()
                                .setUid(nUIDMode.value())
                                .setMessage(message)
                                .build()
                        );
                        break;
                    default:
                        client.onSend(
                            NGameMessage.newBuilder()
                                .setAction(vClass.getSimpleName())
                                .setEvent(method.getName())
                                .setMessage(message)
                                .build()
                        );
                        break;
                }

                return proxy;
            }
        });

    }
}
