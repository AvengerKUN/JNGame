package cn.jisol.ngame.demo.client;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.demo.game.action.unity.client.CNGameUDPAction;
import cn.jisol.ngame.netty.network.udp.session.UDPSession;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;

/**
 * Demo Unity 状态帧同步 的客户类
 */

public class UnityNClient extends QueueNClient<NGameMessage,NGameMessage, UDPSession> {

    @CNGameCActionValue
    public CNGameUDPAction cNGameUDPAction;


    public UnityNClient(UDPSession session) {
        super(session.getCId(),session);
    }

    public UnityNClient(String userId, UDPSession session) {
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
