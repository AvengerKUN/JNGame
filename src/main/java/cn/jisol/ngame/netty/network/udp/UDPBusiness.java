package cn.jisol.ngame.netty.network.udp;

import cn.hutool.core.date.DateTime;
import cn.jisol.ngame.netty.annotation.control.JNMessage;
import cn.jisol.ngame.netty.annotation.control.JNOpen;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import cn.jisol.ngame.netty.network.udp.entity.UDPReceiveMessage;
import cn.jisol.ngame.netty.network.udp.session.UDPSessionGroup;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import org.springframework.core.annotation.AnnotationUtils;

import java.lang.reflect.Method;
import java.util.*;

public class UDPBusiness extends SimpleChannelInboundHandler<UDPReceiveMessage> {

    private static final String JN_OPEN = "JN_OPEN";
    private static final String JN_MESSAGE = "JN_MESSAGE";

    private UDPSessionGroup clients = new UDPSessionGroup();

    private UDPJNettyNetwork network;
    private Object controller;

    private Map<String,List<Method>> forwards = new HashMap<String,List<Method>>(){
        {
            put(JN_OPEN,new ArrayList<>());
            put(JN_MESSAGE,new ArrayList<>());
        }
    };

    /**
     * 关闭清除缓存
     */
    public UDPBusiness(UDPJNettyNetwork network){
        super(false);
        this.network = network;
        this.init();
    }

    private void init() {
        this.controller = network.getApplication().getController();
        this.clients = network.getClients();

        for (Method method : this.controller.getClass().getMethods()) {
            if(Objects.nonNull(AnnotationUtils.findAnnotation(method, JNOpen.class)))
                forwards.get(JN_OPEN).add(method);
            if(Objects.nonNull(AnnotationUtils.findAnnotation(method, JNMessage.class)))
                forwards.get(JN_MESSAGE).add(method);
        }

    }

    @Override
    protected void messageReceived(ChannelHandlerContext ctx, UDPReceiveMessage message) {
        UDPSession session = message.getReceive();

        //查询clients 是否有这个连接 如果没有则 调用Open
        if(Objects.isNull(clients.get(session.getCId()))){
            //将session 添加到 clients 中
            clients.put(session.getCId(),session);
            this.onOpen(message);
        }

        //设置最后活跃时间
        clients.get(session.getCId()).lastAliveTime = DateTime.now();

        //将消息推送到消息接收
        this.onMessage(message);
    }

    private void onOpen(UDPReceiveMessage message){

        for (Method method : forwards.get(JN_OPEN)) {
            try {
                method.invoke(this.controller,this.vMethodParam(message,method));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    //将消息推送到消息接收
    private void onMessage(UDPReceiveMessage message){
        if(Objects.isNull(network)) return;

        for (Method method : forwards.get(JN_MESSAGE)) {
            try {
                method.invoke(this.controller,this.vMethodParam(message,method));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public Object[] vMethodParam(UDPReceiveMessage message,Method method){

        Class<?>[] parameters = method.getParameterTypes();
        Object[] params = new Object[parameters.length];

        for (int i = 0; i < parameters.length; i++) {
            //特殊类型
            if(UDPSession.class.isAssignableFrom(parameters[i])){
                params[i] = message.getReceive();
            }else if(UDPSessionGroup.class.equals(parameters[i])){
                params[i] = clients;
            }

            if(Objects.isNull(params[i])) params[i] = message.vData(parameters[i]);
        }

        return params;
    }
}
