package cn.jisol.ngame.demo.game.action.cocos.frame.service;

import cn.jisol.ngame.client.nclient.SocketNClient;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import org.springframework.stereotype.Component;

/**
 * Cocos Frame 服务端 Action
 */
@Component
@NGameRPCClass
public class SNCocosFrameAction {


    @NGameRPCMethod
    public void nHelloWorld(SocketNClient client){
        System.out.println(String.format("%s客户端 - nHelloWorld",client.getUuid()));
    }

}
