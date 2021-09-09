package cn.jisol.ngame.client.defalut;

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
public class DefaultNClient extends QueueNClient<NGameMessage,NGameMessage> {

    @CNGameCActionValue
    public CNGameAction cNGameAction;

    private DefaultNRoom room;

    public DefaultNClient(Session session) {
        super(session);
    }

    public DefaultNClient(String userId,Session session) {
        super(session);
        this.setUuid(userId);
    }

    @Override
    public void onMessage(NGameMessage data) {
        try {
            NGameRPC.invoke(this,data);
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
    }

}
