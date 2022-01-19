package cn.jisol.ngame.demo.game.action.cocos.bridge.client;

import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;

import java.util.HashMap;
import java.util.List;

@NGameRPCClass
public interface CNCocosBridgeAction {

    /**
     * 接收Actor 状态
     */
    @NGameRPCMethod
    public void vGetStateCallBack(List<HashMap> states);

}
