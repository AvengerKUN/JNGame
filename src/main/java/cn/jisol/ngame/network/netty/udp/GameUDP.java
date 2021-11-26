package cn.jisol.ngame.network.netty.udp;


import cn.jisol.ngame.netty.AJNetty;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import cn.jisol.ngame.network.netty.udp.decoders.DefaultProtoBufDecoder;

/**
 * 启动Netty UDP
 */
@AJNetty(
    port = 1000,
    network = UDPJNettyNetwork.class,
    decoders = {
        DefaultProtoBufDecoder.class
    }
)
public class GameUDP {


}
