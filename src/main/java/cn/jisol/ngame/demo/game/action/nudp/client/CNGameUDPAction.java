package cn.jisol.ngame.demo.game.action.nudp.client;

import cn.jisol.ngame.demo.game.action.ActionRPC;
import cn.jisol.ngame.demo.proto.tools.AnyArrayOuterClass.*;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;

@NGameRPCClass
public interface CNGameUDPAction {


    /**
     * 接收帧同步
     */
    @NUIDMode(ActionRPC.CNGAMEUDPACTION_NGAMESYNCCALLBACK)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGameSyncCallBack(AnyArray nFPSInfo);

}
