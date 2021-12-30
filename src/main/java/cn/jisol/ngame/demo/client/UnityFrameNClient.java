package cn.jisol.ngame.demo.client;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;

public class UnityFrameNClient extends QueueNClient<NGameMessageOuterClass.NGameMessage, NGameMessageOuterClass.NGameMessage, UDPSession> {

    public UnityFrameNClient(UDPSession session) {
        super(session.getCId(),session);
    }

    public UnityFrameNClient(String uuid, UDPSession session) {
        super(uuid,session);
    }

    @Override
    public void onMessage(NGameMessageOuterClass.NGameMessage data) {
        try {
            NGameRPC.invoke(this,data);
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSend(NGameMessageOuterClass.NGameMessage o) {
        if(this.getSession().getIsAlive())
            this.getSession().vSendMessage(o);
    }
}
