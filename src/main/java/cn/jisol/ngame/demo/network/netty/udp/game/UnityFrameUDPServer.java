package cn.jisol.ngame.demo.network.netty.udp.game;

import cn.jisol.ngame.demo.network.netty.udp.decoders.DefaultProtoBufDecoder;
import cn.jisol.ngame.demo.network.netty.udp.encoders.DefaultProtoBufEncoder;
import cn.jisol.ngame.netty.annotation.AJNetty;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import org.springframework.stereotype.Component;

/**
 * 启动Netty UDP
 *
 * Unity 帧同步的测试类
 *
 */
@AJNetty(
        port = 1001,
        network = UDPJNettyNetwork.class,
        decoders = {
                DefaultProtoBufDecoder.class
        },
        encoders = {
                DefaultProtoBufEncoder.class
        }
)
@Component
public class UnityFrameUDPServer {
}
