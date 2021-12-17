package cn.jisol.ngame.demo.client;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.demo.game.action.cocos.client.CNGameAction;
import cn.jisol.ngame.demo.game.action.cocos.frame.client.CNCocosFrameAction;
import cn.jisol.ngame.demo.game.action.cocos.frame.service.SNCocosFrameAction;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;

/**
 * Demo Cocos 帧同步 的客户类
 */
@Setter
@Getter
public class CocosFrameNClient extends QueueNClient<NGameMessageOuterClass.NGameMessage, NGameMessageOuterClass.NGameMessage, Session> {


    @CNGameCActionValue
    public CNCocosFrameAction cnCocosFrameAction;


    public CocosFrameNClient(String uuid, Session session) {
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
