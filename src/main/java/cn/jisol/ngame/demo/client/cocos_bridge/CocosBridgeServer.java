package cn.jisol.ngame.demo.client.cocos_bridge;

import cn.jisol.ngame.client.tool.QueueNClient;
import cn.jisol.ngame.demo.game.action.cocos.bridge.client.CNCocosBridgeAction;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.NGameRPC;
import com.google.protobuf.InvalidProtocolBufferException;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 桥接模式DEMO的服务端
 */
@Getter
@Setter
public class CocosBridgeServer extends QueueNClient<NGameMessageOuterClass.NGameMessage, NGameMessageOuterClass.NGameMessage, Session> {

    //当前服务端的客户端列表
    private List<CocosBridgeClient> clients = new CopyOnWriteArrayList<>();

    @CNGameCActionValue
    public CNCocosBridgeAction cnCocosBridgeAction;

    public CocosBridgeServer(String uuid, Session session) {
        super(uuid, session);
    }

    //玩家加入服务器
    public void nJoinServer(CocosBridgeClient client){
        client.nExitServer();
        clients.remove(client);

        //加入服务器
        clients.add(client);
        client.setServer(this);
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
