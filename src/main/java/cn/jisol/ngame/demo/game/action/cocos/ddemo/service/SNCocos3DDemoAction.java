package cn.jisol.ngame.demo.game.action.cocos.ddemo.service;

import cn.jisol.ngame.demo.client.cocos_3d_demo.Cocos3DClient;
import cn.jisol.ngame.demo.entity.cocos.demo.IDInfo;
import cn.jisol.ngame.demo.proto.cocos.FStateMessage;
import cn.jisol.ngame.ncall.NCallServiceImpl;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.NRPCParam;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import cn.jisol.ngame.sync.fps.NSyncFPSMethod;
import cn.jisol.ngame.sync.fps.NSyncFPSMode;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@NGameRPCClass
public class SNCocos3DDemoAction extends NCallServiceImpl {

    //同步nSyncModes
    public NSyncFPSMode<FStateMessage.NStateMessage> nSyncFPSMode = null;

    //客户端列表
    public Map<String, Cocos3DClient> clients = null;

    //世界的所有Id信息
    public Map<Long, IDInfo> ids = new HashMap<>();

    /**
     * 启动帧同步
     */
    public void nGameSyncStart(){

        if(Objects.nonNull(nSyncFPSMode)) return;

        //创建帧同步对象
        nSyncFPSMode = new NSyncFPSMode<>();
        nSyncFPSMode.setIntervalTime(1000 / 10); //设置同步帧
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
    public void nGameSyncCallBack(String uuid, NFPSInfo<FStateMessage.NStateMessage> nFPSInfo){

        if(Objects.isNull(clients)) return;

        FStateMessage.NStateMessages.Builder builder = FStateMessage.NStateMessages.newBuilder();
        nFPSInfo.getDs().forEach(builder::addMessages);
        FStateMessage.NStateMessages build = builder.build();


        //向所有客户端 发送帧数据
        clients.values().forEach(client -> {

            client.getCnCocos3DDemoAction().nSyncCallBack(build);

        });

    }

    /**
     * 提交状态帧数据
     */
    @NGameRPCMethod
    public void nGameFrameState(FStateMessage.NStateMessages states){

        System.out.println("SNCocos3DDemoAction - nGameFrameState");

        if(Objects.isNull(nSyncFPSMode)) return;
        nSyncFPSMode.addFPSInfos(states.getMessagesList());

    }

    /**
     * 添加玩家的本地nId
     * 玩家离线则删除本地Node
     */
    @NGameRPCMethod
    public void nAddLocalId(@NRPCParam("nId") Long nId,Cocos3DClient client){

        System.out.println("SNCocos3DDemoAction - nAddOfflineId : " + nId);

        IDInfo idInfo = IDInfo.builder()
                .client(client)
                .nId(nId)
                .type(IDInfo.IDEnum.Local)
                .build();

        ids.put(nId,idInfo);

    }

    /**
     * 添加玩家的世界nId
     * 玩家离线则将Node的权限随机分配给其他玩家
     */
    @NGameRPCMethod
    public void nAddWorldId(@NRPCParam("nId") Long nId,Cocos3DClient client){

        System.out.println("SNCocos3DDemoAction - nAddWorldId : " + nId);

        IDInfo idInfo = IDInfo.builder()
                .client(client)
                .nId(nId)
                .type(IDInfo.IDEnum.World)
                .build();

        ids.put(nId,idInfo);

    }

    //删除指定ids
    public void nDeleteIds(List<Long> ids){

        List<Long> deleteIds = new ArrayList<>();
        ids.forEach(id -> {
            this.ids.remove(id);
            deleteIds.add(id);
        });

        //通知所有玩家删除
        this.clients.values().forEach(client -> {
            client.cnCocos3DDemoAction.nDeleteIds(deleteIds);
        });

    }

    //更新指定nId
    public void nUpdateID(IDInfo idInfo){

        if(idInfo.getClient() instanceof Cocos3DClient){
            ((Cocos3DClient)idInfo.getClient()).cnCocos3DDemoAction.nUpdateId(idInfo.getNId(),idInfo.getType());
        }

    }


}
