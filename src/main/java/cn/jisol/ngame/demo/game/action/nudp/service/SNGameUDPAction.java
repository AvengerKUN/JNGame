package cn.jisol.ngame.demo.game.action.nudp.service;

import cn.jisol.ngame.client.nclient.UDPClient;
import cn.jisol.ngame.demo.game.action.ActionRPC;
import cn.jisol.ngame.demo.proto.maction.MSyncFPSInfo.*;
import cn.jisol.ngame.demo.proto.sync.DActorOwnerOuterClass;
import cn.jisol.ngame.demo.proto.sync.DSyncInfosOuterClass.*;
import cn.jisol.ngame.demo.proto.tools.AnyArrayOuterClass.*;
import cn.jisol.ngame.ncall.NCallServiceImpl;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import cn.jisol.ngame.sync.fps.NSyncFPSMethod;
import cn.jisol.ngame.sync.fps.NSyncFPSMode;
import com.google.protobuf.Any;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@NGameRPCClass
@Getter
@Setter
public class SNGameUDPAction extends NCallServiceImpl {

    //同步nSyncModes
    private Map<String, NSyncFPSMode<NAction>> nSyncModes = new HashMap<>();

    //服务器ID - 客户端列表
    private Map<String, Map<String, UDPClient>> rooms = new HashMap<>();

    @NUIDMode(1)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nUID(MVector3 vector3){
        System.out.println(String.format("SNGameUDPAction - nUID : X:%s Y:%s Z:%s",vector3.getX(),vector3.getY(),vector3.getZ()));
    }

    @NGameRPCMethod
    public void nMethod(MVector3 vector3){
        System.out.println(String.format("SNGameAction - nMethod : X:%s Y:%s Z:%s",vector3.getX(),vector3.getY(),vector3.getZ()));
    }


    /**
     * 将消息添加到 nSyncModes 中
     * @param action
     */
    @NUIDMode(ActionRPC.SNGameUDPAction_addSyncInfo)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void addSyncInfo(NAction action,UDPClient client){

        String uuid = client.getSession().getSId();

        NSyncFPSMode<NAction> nSyncMode = null;
        if(Objects.nonNull(nSyncMode = this.nSyncModes.get(uuid))){
            nSyncMode.addFPSInfo(action);
        }

    }

    /**
     * 开始帧同步模式
     */
    @NUIDMode(ActionRPC.SNGameUDPAction_nGameSyncStart)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGameSyncStart(UDPClient client){

        String uuid = client.getSession().getSId();

        NSyncFPSMode<NAction> nSyncMode = null;
        if(Objects.isNull(nSyncMode = this.nSyncModes.get(uuid))){

            nSyncMode = new NSyncFPSMode<>();
            nSyncMode.setIntervalTime(100); //设置延迟时间
            nSyncMode.setUuid(uuid);
            this.nSyncModes.put(uuid,nSyncMode);
            //添加同步功能
            addRegister(nSyncMode);
        }

        //开启同步
        nSyncMode.start();
        System.out.println("SNGnGameSyncCallBack :ameAction - nGameSyncStart : 开始同步模式");
    }



    /**
     * 同步模式回调
     */
    @NSyncFPSMethod
    public void nGameSyncCallBack(String uuid, NFPSInfo<NAction> nFPSInfo){

        Map<String, UDPClient> clients = this.rooms.get(uuid);

        DSyncInfos.Builder infos = DSyncInfos.newBuilder();

        for (int i = 0; i < nFPSInfo.getDs().size(); i++) {
            infos.addMessage(i,Any.pack(nFPSInfo.getDs().get(i)));
        }

        //设置帧索引
        infos.setIndex(nFPSInfo.getI().intValue());

        DSyncInfos build = infos.build();

        //发送封装好的 向所有client 调用 nGameSyncCallBack
        for (UDPClient value : clients.values()) {
            value.cNGameUDPAction.nGameSyncCallBack(build);
        }

    }


    //为自己 更新某个 Actor 权限
    @NUIDMode(ActionRPC.SNGameUDPAction_nGetActorOwner)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGetActorOwner(DActorOwnerOuterClass.DActorOwner owner,UDPClient client){

        //获取同步
        String sId = client.getSession().getSId();
        NSyncFPSMode<NAction> nActionNSyncFPSMode = null;
        if(Objects.isNull(nActionNSyncFPSMode = this.nSyncModes.get(sId))){
            return;
        }

        System.out.println("SNGameUDPAction - nGetActorOwner");


        //获取所有玩家
        for (UDPClient value : this.rooms.get(sId).values()){

            //写入权重值(判断是否是权限拥有者)
            DActorOwnerOuterClass.DActorOwner.Builder builder = DActorOwnerOuterClass.DActorOwner.newBuilder()
                    .setOwner(nActionNSyncFPSMode.getIndex())
                    .setUuid(owner.getUuid())
                    .setIsOwn(value.getUuid().equals(client.getUuid()));

            //发送权限
            value.cNGameUDPAction.nUpdateWeight(builder.build());
        }

    }

}
