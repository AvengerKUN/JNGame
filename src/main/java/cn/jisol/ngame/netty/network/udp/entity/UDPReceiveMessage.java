package cn.jisol.ngame.netty.network.udp.entity;

import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
public class UDPReceiveMessage {

    private UDPSession receive; //接收者
    private List<Object> messages; //消息

    public boolean addMessage(Object o){
        messages.add(o);
        return true;
    }

    public <T> T vData(Class<T> tClass){
        for (Object message : messages) {
            if (tClass.isAssignableFrom(message.getClass())){
                return (T) message;
            }
        }
        return null;
    }

}
