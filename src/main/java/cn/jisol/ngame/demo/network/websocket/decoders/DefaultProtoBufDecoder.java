package cn.jisol.ngame.demo.network.websocket.decoders;

import cn.jisol.ngame.demo.proto.message.NGameMessageOuterClass;

import javax.websocket.DecodeException;
import javax.websocket.Decoder;
import javax.websocket.EndpointConfig;
import java.io.IOException;
import java.io.InputStream;

public class DefaultProtoBufDecoder implements Decoder.BinaryStream<NGameMessageOuterClass.NGameMessage> {
    @Override
    public NGameMessageOuterClass.NGameMessage decode(InputStream inputStream) throws DecodeException, IOException {
        return NGameMessageOuterClass.NGameMessage.parseFrom(inputStream);
    }

    @Override
    public void init(EndpointConfig endpointConfig) {

    }

    @Override
    public void destroy() {

    }
}
