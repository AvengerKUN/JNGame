package cn.jisol.ngame.demo.game.action.cocos.bridge.client;

import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;

import java.util.HashMap;
import java.util.List;

@NGameRPCClass
public interface CNCocosBridgeAction {

    /**
     * 接收Actor 状态数据
     */
    @NGameRPCMethod
    public void vGetStateCallBack(HashMap states);

    /**
     * 接收Actor 输入数据
     */
    @NGameRPCMethod
    public void vGetInputCallBack(List<HashMap> inputs);

    /**
     * 接收Actor 帧数据
     */
    @NGameRPCMethod
    public void vGetFrameCallBack(HashMap frame);

}
