package cn.jisol.ngame.demo.game.action.cocos.ddemo.client;

import cn.jisol.ngame.demo.entity.cocos.demo.IDInfo;
import cn.jisol.ngame.demo.proto.cocos.FStateMessage;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;

import java.util.List;

@NGameRPCClass
public interface CNCocos3DDemoAction {

    /**
     * 同步回调
     * @param states
     */
    @NGameRPCMethod
    void nSyncCallBack(FStateMessage.NStateMessages states);

    /**
     * 其他玩家加入了游戏通知
     */
    @NGameRPCMethod
    void nJoinGame();

    /**
     * 删除ids
     * @param ids
     */
    @NGameRPCMethod
    void nDeleteIds(List<Long> ids);

    /**
     * 更新Id
     */
    @NGameRPCMethod
    void nUpdateId(Long id, IDInfo.IDEnum type);
}
