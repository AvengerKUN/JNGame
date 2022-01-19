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

    }

    /**
     * 发送状态数据(服务器)
     */
    @NGameRPCMethod
    public void vSendState(CocosBridgeServer server, @NRPCParam("states") List<HashMap> states){

        System.out.println("SNCocosBridgeAction - vSendState 发送状态数据 : " + states.size());

        //向所有的客户端发送状态
        server.getClients().forEach(client -> {
            client.getCnCocosBridgeAction().vGetStateCallBack(states);
        });

    }

}
