package cn.jisol.ngame.demo.network.websocket.encoders;

import com.google.protobuf.AbstractMessage;

import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;
import java.io.IOException;
import java.io.OutputStream;

public class DefaultProtoBufEncoder implements Encoder.BinaryStream<AbstractMessage> {
    @Override
    public void init(EndpointConfig endpointConfig) {

    }

    @Override
    public void destroy() {

    }

    @Override
    public void encode(AbstractMessage abstractMessage, OutputStream outputStream) throws EncodeException, IOException {
        outputStream.write(abstractMessage.toByteArray());
    }
}
