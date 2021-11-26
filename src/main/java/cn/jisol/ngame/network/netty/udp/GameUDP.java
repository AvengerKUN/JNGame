package cn.jisol.ngame.network.netty.udp;


import cn.jisol.ngame.netty.JNetty;
import cn.jisol.ngame.netty.AJNetty;
import cn.jisol.ngame.netty.network.JNettyNetwork;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import cn.jisol.ngame.network.netty.udp.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.network.netty.udp.encoders.DefaultProtoBufEncoder;
import io.netty.channel.Channel;
import io.netty.handler.codec.MessageToByteEncoder;
import io.netty.handler.codec.MessageToMessageDecoder;

import java.util.ArrayList;

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
                .decoders(new MessageToMessageDecoder[]{new DefaultProtoBufDecoder()})
//                .encoders(new MessageToByteEncoder[]{new DefaultProtoBufEncoder()})
            .build();
    }

    @Override
    public void close(Channel channel) {
        super.close(channel);
    }
}
