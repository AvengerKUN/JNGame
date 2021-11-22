package cn.jisol.ngame.network.netty.udp;


import cn.jisol.ngame.netty.JNetty;
import cn.jisol.ngame.netty.AJNetty;
import cn.jisol.ngame.netty.network.JNettyNetwork;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import io.netty.channel.Channel;

/**
 * 启动Netty UDP
 */
@AJNetty
public class GameUDP extends JNetty<UDPJNettyNetwork> {

    @Override
    public UDPJNettyNetwork initNetty() {
        return UDPJNettyNetwork
            .builder()
                .port(1000)
            .build();
    }

    @Override
    public void close(Channel channel) {
        super.close(channel);
    }
}
