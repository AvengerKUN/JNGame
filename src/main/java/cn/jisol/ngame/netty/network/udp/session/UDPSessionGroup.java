package cn.jisol.ngame.netty.network.udp.session;

import java.util.concurrent.ConcurrentHashMap;

public class UDPSessionGroup extends ConcurrentHashMap<String,UDPSession> {

    public void vSendMessage(Object msg){
        for (UDPSession value : this.values()) {
            value.vSendMessage(msg);
        }
    }

}
