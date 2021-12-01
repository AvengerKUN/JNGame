package cn.jisol.ngame.game.action.nwebsokcet.client;

import cn.jisol.ngame.dto.DSyncMessage;
import cn.jisol.ngame.proto.snake.GSnakeMessage;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import cn.jisol.ngame.sync.fps.NFPSInfo;

import java.util.HashMap;

/**
 * 这是通知客户端的方法适用NGame中 (WebSocket UDP)
 */

@NGameRPCClass
public interface CNGameAction {

    /**
     * RPC 传输测试 ProtoBuf对象传输
     * 推荐: 底层传输格式 ProtoBuf
     */
    @NGameRPCMethod
    public void nGameProtoBuf(GSnakeMessage.GSnakeHelloMessage message);


    /**
     * RPC 传输测试 参数传输
     * 不推荐 : 底层实现数据格式是 JSON
     */
    @NGameRPCMethod
    public void nGameParams(String name, Integer userId, HashMap user);

    /**
     * RPC 传输测试 空参传输
     */
    @NGameRPCMethod
    public void nGameHello();


    /**
     * RPC 传输测试 UID
     */
    @NUIDMode("1")
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGameUUIDMode();

    /**
     * 接收帧同步
     */
    @NGameRPCMethod
    public void nGameSyncCallBack(NFPSInfo<DSyncMessage> nFPSInfo);
}
