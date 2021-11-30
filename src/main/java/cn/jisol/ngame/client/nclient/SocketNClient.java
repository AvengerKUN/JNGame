package cn.jisol.ngame.client.nclient;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.game.action.client.CNGameAction;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.room.defalut.DefaultNRoom;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;

@Setter
@Getter
public class SocketNClient extends QueueNClient<NGameMessage,NGameMessage,Session> {

    @CNGameCActionValue
    public CNGameAction cNGameAction;

    private DefaultNRoom room;

    public SocketNClient(Session session) {
        super(session.getId(),session);
    }

    public SocketNClient(String userId,Session session) {
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
        if(this.getSession().isOpen())
            this.getSession().getAsyncRemote().sendObject(o);
    }

}
