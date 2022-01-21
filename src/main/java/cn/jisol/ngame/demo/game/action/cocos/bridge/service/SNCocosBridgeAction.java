package cn.jisol.ngame.demo.game.action.cocos.bridge.service;

import cn.jisol.ngame.demo.client.cocos_bridge.CocosBridgeClient;
import cn.jisol.ngame.demo.client.cocos_bridge.CocosBridgeServer;
import cn.jisol.ngame.demo.network.websocket.game.CocosBridgeWebSocket;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.NRPCParam;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

/**
 * Cocos Bridge 服务端 Action
 */
@Component
@NGameRPCClass
public class SNCocosBridgeAction {



    /**
     * 玩家加入服务器
     * @param id 服务器Id
     */
    @NGameRPCMethod
    public void nJoinServer(CocosBridgeClient client,@NRPCParam("id") String id){

        System.out.println("SNCocosBridgeAction - nJoinServer 加入房间 : " + id);

        //获取服务器
        CocosBridgeServer server;
        if(Objects.isNull(server = CocosBridgeWebSocket.SERVERS.get(id))) return;

        //加入服务器
        server.nJoinServer(client);

        //加入服务器 将服务器的Actor 推送到玩家
        server.getCnCocosBridgeAction().vAskWorldState(client.getUuid());

    }

    /**
     * 向所有客户端发送状态数据 (服务器)
     */
    @NGameRPCMethod
    public void vSAllSendState(CocosBridgeServer server, @NRPCParam("states") HashMap states){

        System.out.println("SNCocosBridgeAction - vSAllSendState");

        //向所有的客户端发送状态
        server.getClients().forEach(client -> {
            client.getCnCocosBridgeAction().vGetStateCallBack(states);
        });

    }

    /**
     * 向指定客户端发送状态数据 (服务器)
     */
    @NGameRPCMethod
    public void vSSendState(CocosBridgeServer server,@NRPCParam("uuid") String uuid, @NRPCParam("states") HashMap states){

        System.out.println("SNCocosBridgeAction - vSSendState");

        //向所有的客户端发送状态
        server.getClients().forEach(client -> {
            if(client.getUuid().equals(uuid))
                client.getCnCocosBridgeAction().vGetStateCallBack(states);
        });

    }


    /**
     * 向所有客户端发送帧数据 (服务器)
     */
    @NGameRPCMethod
    public void vSSendFrame(CocosBridgeServer server, @NRPCParam("frames") HashMap frames){

        System.out.println("SNCocosBridgeAction - vSSendFrame");

        //向所有的客户端发送状态
        server.getClients().forEach(client -> {
            client.getCnCocosBridgeAction().vGetFrameCallBack(frames);
        });

    }


    /**
     * 发送帧操作给服务端(客户端) 操作
     */
    @NGameRPCMethod
    public void vCSendInput(CocosBridgeClient client, @NRPCParam("inputs") List<Object> inputs){

        if(Objects.isNull(client.getServer())) return;

        //向服务器发送帧数据
        client.getServer().getCnCocosBridgeAction().vGetInputCallBack(inputs);

    }

}
