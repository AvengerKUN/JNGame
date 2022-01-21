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
    void vGetStateCallBack(HashMap states);

    /**
     * 接收Actor 输入数据
     */
    @NGameRPCMethod
    void vGetInputCallBack(List<Object> inputs);

    /**
     * 接收Actor 帧数据
     */
    @NGameRPCMethod
    void vGetFrameCallBack(HashMap frame);


    /**
     * 请求游戏服务器的Actor状态
     */
    @NGameRPCMethod
    void vAskWorldState(String uuid);
}
