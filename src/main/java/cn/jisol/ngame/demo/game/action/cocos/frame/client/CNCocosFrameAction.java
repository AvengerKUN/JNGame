package cn.jisol.ngame.demo.game.action.cocos.frame.client;

import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.sync.fps.NFPSInfo;


/**
 * Cocos Frame 客户端 Action
 */
@NGameRPCClass
public interface CNCocosFrameAction {

    /**
     * 接收帧同步
     */
    @NGameRPCMethod
    public void nGameSyncInputCallBack(NFPSInfo<Object> nFPSInfo);

}
