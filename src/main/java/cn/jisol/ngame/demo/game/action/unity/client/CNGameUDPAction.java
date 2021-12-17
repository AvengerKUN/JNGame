package cn.jisol.ngame.demo.game.action.unity.client;

import cn.jisol.ngame.demo.game.action.ActionRPC;
import cn.jisol.ngame.demo.proto.sync.DActorOwnerOuterClass.*;
import cn.jisol.ngame.demo.proto.sync.DSyncInfosOuterClass.*;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;

@NGameRPCClass
public interface CNGameUDPAction {


    /**
     * 接收帧同步
     */
    @NUIDMode(ActionRPC.CNGameUDPAction_nGameSyncCallBack)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGameSyncCallBack(DSyncInfos nFPSInfo);

    //通知玩家更新权重
    @NUIDMode(ActionRPC.CNGameUDPAction_nUpdateWeight)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nUpdateWeight(DActorOwner owner);

}
