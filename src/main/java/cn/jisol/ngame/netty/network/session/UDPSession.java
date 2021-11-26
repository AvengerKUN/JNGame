package cn.jisol.ngame.netty.network.session;

import io.netty.channel.socket.DatagramPacket;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class UDPSession {

    private DatagramPacket target;
    private List<Object> messages;

    public UDPSession(DatagramPacket target){
        this.target = target;
        this.messages = new ArrayList<>();
    }

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
