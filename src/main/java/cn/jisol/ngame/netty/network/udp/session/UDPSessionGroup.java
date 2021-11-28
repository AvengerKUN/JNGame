package cn.jisol.ngame.netty.network.udp.session;

import java.util.HashMap;

public class UDPSessionGroup extends HashMap<String,UDPSession> {

    public void vSendMessage(Object msg){
        for (UDPSession value : this.values()) {
            value.vSendMessage(msg);
        }
    }

}
