package cn.jisol.ngame.netty;

import cn.jisol.ngame.netty.network.JNettyNetwork;
import cn.jisol.ngame.network.netty.udp.decoders.DefaultProtoBufDecoder;
import io.netty.handler.codec.MessageToMessageDecoder;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

/**
 * JNetty 应用类
 */
@Getter
@Setter
public class JNettyApplication {

    private int port;
    private Object controller;
    private JNettyNetwork network;

    private List<MessageToMessageDecoder> decoders;

    //启动
    public boolean start(){

        if(Objects.isNull(controller) || Objects.isNull(network)) return false;
        return network.start(this);

    }

    public void addDecoder(MessageToMessageDecoder decoder){
        if(Objects.isNull(decoders))
            decoders = new LinkedList<>();
        decoders.add(decoder);
    }

}
