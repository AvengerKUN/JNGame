package cn.jisol.ngame.demo.game.action.unity.service;

import cn.jisol.ngame.demo.client.UnityNClient;
import cn.jisol.ngame.demo.entity.udp.SActorOwner;
import cn.jisol.ngame.demo.game.action.ActionRPC;
import cn.jisol.ngame.demo.proto.maction.MSyncFPSInfo.*;
import cn.jisol.ngame.demo.proto.sync.DActorOwnerOuterClass;
import cn.jisol.ngame.demo.proto.sync.DSyncInfosOuterClass.*;
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
import java.util.concurrent.ConcurrentHashMap;

@Component
@NGameRPCClass
@Getter
@Setter
public class SNGameUDPAction extends NCallServiceImpl {

    //同步nSyncModes
    private Map<String, NSyncFPSMode<NAction>> nSyncModes = new HashMap<>();

    //服务器ID - 客户端列表
    private Map<String, Map<String, UnityNClient>> rooms = new HashMap<>();

    //记录Actor的权限组(key = actorid)
    private Map<String, SActorOwner> dActorOwners = new ConcurrentHashMap<>();


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
    public void addSyncInfo(NAction action, UnityNClient client){

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
    public void nGameSyncStart(UnityNClient client){

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

        Map<String, UnityNClient> clients = this.rooms.get(uuid);

        DSyncInfos.Builder infos = DSyncInfos.newBuilder();

        for (int i = 0; i < nFPSInfo.getDs().size(); i++) {
            infos.addMessage(i,Any.pack(nFPSInfo.getDs().get(i)));
        }

        //设置帧索引
        infos.setIndex(nFPSInfo.getI().intValue());

        DSyncInfos build = infos.build();

        //发送封装好的 向所有client 调用 nGameSyncCallBack
        for (UnityNClient value : clients.values()) {
            value.cNGameUDPAction.nGameSyncCallBack(build);
        }

    }


    //为自己 更新某个 Actor 权限
    //获取某个Actor的权限 如果 有人有这个权限则通知别人的
    @NUIDMode(ActionRPC.SNGameUDPAction_nGetActorOwner)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGetActorOwner(DActorOwnerOuterClass.DActorOwner owner, UnityNClient client){

        //获取同步
        String sId = client.getSession().getSId();
        NSyncFPSMode<NAction> nActionNSyncFPSMode = null;
        if(Objects.isNull(nActionNSyncFPSMode = this.nSyncModes.get(sId))){
            return;
        }

        System.out.println("SNGameUDPAction - nGetActorOwner");

        SActorOwner sActorOwner = dActorOwners.get(String.valueOf(owner.getUuid()));

        //找不到权重则创建一个
        if(Objects.isNull(sActorOwner)){
            sActorOwner = SActorOwner.builder()
                    .client(client)
                    .owner(
                        DActorOwnerOuterClass.DActorOwner.newBuilder()
                        .setOwner(nActionNSyncFPSMode.getIndex())
                        .setUuid(owner.getUuid()).build()
                    ).build();

            //保存权重
            dActorOwners.put(String.valueOf(owner.getUuid()),sActorOwner);
        }


        //通知所有玩家ActorOwner
        this.sActorOwnerNotice(this.rooms.get(sId).values(),sActorOwner);

    }


    //为自己 更新某个 Actor 权限
    //强制获取某个Actor的权限
    @NUIDMode(ActionRPC.SNGameUDPAction_nGetForceActorOwner)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGetForceActorOwner(DActorOwnerOuterClass.DActorOwner owner, UnityNClient client){
        //获取同步
        String sId = client.getSession().getSId();
        NSyncFPSMode<NAction> nActionNSyncFPSMode = null;
        if(Objects.isNull(nActionNSyncFPSMode = this.nSyncModes.get(sId))){
            return;
        }

        //创建权重
        SActorOwner sActorOwner = SActorOwner.builder()
                .owner(
                        DActorOwnerOuterClass.DActorOwner.newBuilder()
                                .setOwner(nActionNSyncFPSMode.getIndex())
                                .setUuid(owner.getUuid())
                                .build()
                )
                .client(client)
                .build();

        //保存权重
        dActorOwners.put(String.valueOf(owner.getUuid()),sActorOwner);

        //通知
        this.sActorOwnerNotice(this.rooms.get(sId).values(),sActorOwner);
    }

    //权重通知
    public void sActorOwnerNotice(Collection<UnityNClient> values, SActorOwner sActorOwner){

        for (UnityNClient value : values){

            //写入权重值(判断是否是权限拥有者)
            DActorOwnerOuterClass.DActorOwner.Builder builder = DActorOwnerOuterClass.DActorOwner.newBuilder()
                    .setOwner(sActorOwner.getOwner().getOwner())
                    .setUuid(sActorOwner.getOwner().getUuid())
                    .setIsOwn(value.getUuid().equals(sActorOwner.getClient().getUuid()));

            //发送更新权限
            value.cNGameUDPAction.nUpdateWeight(builder.build());
        }

    }


}
