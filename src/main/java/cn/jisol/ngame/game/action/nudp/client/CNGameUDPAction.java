package cn.jisol.ngame.game.action.nudp.client;

import cn.jisol.ngame.proto.tools.AnyArrayOuterClass.*;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;

@NGameRPCClass
public interface CNGameUDPAction {


    /**
     * 接收帧同步
     */
    @NGameRPCMethod
    public void nGameSyncCallBack(AnyArray nFPSInfo);

}
