package cn.jisol.ngame.demo.client.cocos_3d_demo;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.demo.entity.cocos.demo.IDInfo;
import cn.jisol.ngame.demo.game.action.cocos.ddemo.client.CNCocos3DDemoAction;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
public class Cocos3DClient extends QueueNClient<NGameMessageOuterClass.NGameMessage, NGameMessageOuterClass.NGameMessage, Session> {

    @CNGameCActionValue
    public CNCocos3DDemoAction cnCocos3DDemoAction;

    public Cocos3DClient(String uuid, Session session) {
        super(uuid, session);
    }

    @Override
    public void onMessage(NGameMessageOuterClass.NGameMessage data) {
        //调用RPC功能
        try {
            NGameRPC.invoke(this,data);
        } catch (InvalidProtocolBufferException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSend(NGameMessageOuterClass.NGameMessage o) {
        if(this.getSession().isOpen())
            this.getSession().getAsyncRemote().sendObject(o);
    }

}
