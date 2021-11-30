package cn.jisol.ngame.client.nclient;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;

public class UDPClient extends QueueNClient<NGameMessage,NGameMessage, UDPSession> {

    public UDPClient(UDPSession session) {
        super(session.getSid(),session);
    }

    public UDPClient(String userId,UDPSession session) {
        super(userId,session);
    }

    @Override
    public void onMessage(NGameMessage data) {
        try {
            NGameRPC.invoke(this,data);
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSend(NGameMessage o) {
        if(this.getSession().getIsAlive())
            this.getSession().vSendMessage(o);
    }
}
