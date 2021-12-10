using Assets.Game.plugs.NGame.sync;
using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.ngame.ncontroller;
using Assets.Game.Script.ngame.nsync;
using Assets.Game.Script.NGame.protobuf;
using Assets.Game.Script.plugs;
using Google.Protobuf.WellKnownTypes;
using NGame.protobuf;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[NGameRPCClass]
public class CNGameUDPAction : NGameRPCIntensifier
{

    /**
     * 接收帧同步
     */
    [NGameRPCMethod, NUIDMode(ActionRPC.CNGameUDPAction_nGameSyncCallBack)]
    public void nGameSyncCallBack(DSyncInfos nFPSInfo,NGameApplication nGame) {

        NGameDefaultSync nGameDefaultSync = null;

        //接收帧同步消息 交给 NGameDefaultSync 管理 (找到是否有这个网络同步管理Class)
        foreach (NGameSync nGameSync in nGame.nNGameSyncs)
        {
            if (typeof(NGameDefaultSync).Equals(nGameSync.GetType()))
            {
                nGameDefaultSync = nGameSync as NGameDefaultSync;
            }
        }

        //找不到则不处理这个帧数据
        if (nGameDefaultSync == null) return;

        //找到则交给 NGameDefaultSync 管理 
        //Loom.QueueOnMainThread(() => {
        //    nGameDefaultSync.SNTick(nFPSInfo);
        //});

        //交给下一帧处理
        UnityTask.NextTask(() =>
        {
            nGameDefaultSync.SNTick(nFPSInfo);
        });

        

    }

    /// <summary>
    /// 接收玩家更新权重
    /// </summary>
    /// <param name="owner"></param>
    [NGameRPCMethod, NUIDMode(ActionRPC.CNGameUDPAction_nUpdateWeight)]
    public void nUpdateWeight(DActorOwner owner, NGameApplication nGame)
    {

        NGameDefaultSync nGameDefaultSync = GetNGameSync(new NGameDefaultSync(), nGame);

        //交给下一帧处理
        UnityTask.NextTask(() =>
        {
            //交接给同步类处理
            nGameDefaultSync.NUpdateActorOwner(owner);
        });

    }

    public T GetNGameSync <T> (T type, NGameApplication nGame) where T : NGameSync
    {

        //接收帧同步消息 交给 NGameDefaultSync 管理 (找到是否有这个网络同步管理Class)
        foreach (NGameSync nGameSyncModel in nGame.nNGameSyncs)
        {
            if (type.GetType().Equals(nGameSyncModel.GetType()))
            {
                type = nGameSyncModel as T;
            }
        }

        return type;

    }

}
