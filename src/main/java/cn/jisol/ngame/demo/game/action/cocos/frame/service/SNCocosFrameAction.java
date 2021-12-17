package cn.jisol.ngame.demo.game.action.cocos.frame.service;

import cn.jisol.ngame.demo.client.CocosFrameNClient;
import cn.jisol.ngame.demo.client.CocosNClient;
import cn.jisol.ngame.demo.proto.maction.MSyncFPSInfo;
import cn.jisol.ngame.ncall.NCallServiceImpl;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import cn.jisol.ngame.sync.fps.NSyncFPSMethod;
import cn.jisol.ngame.sync.fps.NSyncFPSMode;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;


/**
 * Cocos Frame 服务端 Action
 */
@Component
@NGameRPCClass
public class SNCocosFrameAction extends NCallServiceImpl {

    //同步nSyncModes
    NSyncFPSMode<Object> nSyncFPSMode = null;

    //客户端列表
    public Map<String, CocosFrameNClient> clients = null;

    @NGameRPCMethod
    public void nHelloWorld(CocosFrameNClient client){
        System.out.println(String.format("%s客户端 - nHelloWorld",client.getUuid()));
    }

    /**
     * 启动帧同步
     */
    public void nGameSyncStart(){

        if(Objects.nonNull(nSyncFPSMode)) return;

        //创建帧同步对象
        nSyncFPSMode = new NSyncFPSMode<>();
        nSyncFPSMode.setIntervalTime(1000/10); //设置同步帧
        //添加同步功能
        addRegister(nSyncFPSMode);

        //开启同步
        nSyncFPSMode.start();
        System.out.println("SNCocosFrameAction - nGameSyncStart : 开始同步模式");

    }


    /**
     * 同步模式回调
     */
    @NSyncFPSMethod
    public void nGameSyncCallBack(String uuid, NFPSInfo<Object> nFPSInfo){

        if(Objects.isNull(clients)) return;

        //向所有客户端 发送帧数据
        clients.values().forEach(client -> {
            client.getCnCocosFrameAction().nGameSyncCallBack(nFPSInfo);
        });

    }


}
