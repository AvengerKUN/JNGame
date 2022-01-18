package cn.jisol.ngame.demo.client.cocos_bridge;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;

/**
 * 桥接模式DEMO的客户端
 */
@Getter
@Setter
public class CocosBridgeClient extends QueueNClient<NGameMessageOuterClass.NGameMessage, NGameMessageOuterClass.NGameMessage, Session> {

    //当前客户端在的服务端类 (游戏服务器)
    private CocosBridgeServer server;

    public CocosBridgeClient(String uuid, Session session) {
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
