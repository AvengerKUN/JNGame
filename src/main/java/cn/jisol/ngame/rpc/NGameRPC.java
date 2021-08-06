package cn.jisol.ngame.rpc;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import cn.jisol.ngame.client.NClient;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import cn.jisol.ngame.spring.SpringBeanUtils;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Message;
import org.springframework.util.StringUtils;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class NGameRPC {

    private final static Map<Class<?>, ArrayList<Method>> vRPC = new HashMap<>();

    public static void invoke(NClient client,NGameMessage nGameMessage,RunNewObject runNewObject) throws InvalidProtocolBufferException {

        Class<?> rClass = null;
        Method rMethod = null;

        //默认模式 通过Action Event 找到方法
        if(!StringUtils.isEmpty(nGameMessage.getAction()) && !StringUtils.isEmpty(nGameMessage.getEvent())){
            for(Class<?> iClass : vRPC.keySet()){
                if(nGameMessage.getAction().equals(iClass.getSimpleName())){
                    rClass = iClass;
                    for(Method iMethod : vRPC.get(iClass)){
                        if(iMethod.getName().equals(nGameMessage.getEvent()))
                            rMethod = iMethod;
                    }
                }
            }
        } //UID模式 通过 UID 找到方法
        else if(!StringUtils.isEmpty(nGameMessage.getUid())){
            for(Class<?> iClass : vRPC.keySet()){
                for(Method iMethod : vRPC.get(iClass)){
                    NUIDMode uid = null;
                    if(Objects.nonNull(uid = AnnotationUtil.getAnnotation(iMethod,NUIDMode.class)) && uid.value().equals(nGameMessage.getUid())){
                        rClass = iClass;
                        rMethod = iMethod;
                    }
                }
            }
        }

        if(Objects.isNull(rClass) || Objects.isNull(rMethod)) return;

        //接收的参数类型
        Parameter[] parameters = rMethod.getParameters();

        Object[] param = new Object[parameters.length];

        HashMap<Object, Object> message = new HashMap<>();

        if(nGameMessage.getMessage().getTypeUrl().length() == 0){
            message = JSONUtil.toBean(nGameMessage.getMessage().getValue().toStringUtf8(),HashMap.class);
        }


        for (int i = 0; i < parameters.length; i++) {

            NRPCParam nRPCParam;

            //判断是否存在 NRPCParam 注解
            if(Objects.nonNull(nRPCParam = AnnotationUtil.getAnnotation(parameters[i],NRPCParam.class))){
                if(message.get(nRPCParam.value()).getClass().equals(JSONObject.class)){
                    param[i] = ((JSONObject)message.get(nRPCParam.value())).toBean(parameters[i].getType());
                }else{
                    param[i] = message.get(nRPCParam.value());
                }
            }else if(NClient.class.equals(parameters[i].getType()) || NClient.class.isAssignableFrom(parameters[i].getType()) ){ //判断类型是否是Client
                param[i] = client;
            }else if(NGameMessage.class.equals(parameters[i].getType())){ //判断类型是否是NGameMessage
                param[i] = nGameMessage;
            }else if(Message.class.isAssignableFrom(parameters[i].getType())){
                if(nGameMessage.getMessage().getTypeUrl().length() > 0)
                    param[i] = nGameMessage.getMessage().unpack((Class<Message>)parameters[i].getType());
            }

        }

        try {
            rMethod.invoke(runNewObject.run(rClass),param);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static void invoke(NClient client,NGameMessage nGameMessage) throws InvalidProtocolBufferException {
        invoke(client,nGameMessage, SpringBeanUtils::getBean);
    }

    public static void addRPCMethod(Class<?> vClass,Method vMethod){
        if(Objects.isNull(vRPC.get(vClass))){
            vRPC.put(vClass,new ArrayList<>());
        }
        vRPC.get(vClass).add(vMethod);
    }

    public static int lClassSize(){
        return vRPC.size();
    }

    public interface RunNewObject {
        public Object run(Class<?> vClass) throws IllegalAccessException, InstantiationException;
    }

}
