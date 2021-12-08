using Assets.Game.plugs.NGame.sync;
using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.ngame.nsync;
using Assets.Game.Script.NGame.protobuf;
using Assets.Game.Script.plugs;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[NGameRPCClass]
public class CNGameUDPAction : NGameRPCIntensifier
{

    /**
     * 接收帧同步
     */
    [NGameRPCMethod]
    public void nGameSyncCallBack(AnyArray nFPSInfo,NGameApplication nGame) {

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

        UnityTask.Task(() =>
        {
            nGameDefaultSync.SNTick(nFPSInfo);
        });

    }

}
