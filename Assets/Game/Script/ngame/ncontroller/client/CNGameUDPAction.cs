using Assets.Game.plugs.NGame.sync;
using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.ngame.ncontroller;
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
     * ����֡ͬ��
     */
    [NGameRPCMethod, NUIDMode(ActionRPC.CNGAMEUDPACTION_NGAMESYNCCALLBACK)]
    public void nGameSyncCallBack(AnyArray nFPSInfo,NGameApplication nGame) {

        NGameDefaultSync nGameDefaultSync = null;

        //����֡ͬ����Ϣ ���� NGameDefaultSync ���� (�ҵ��Ƿ����������ͬ������Class)
        foreach (NGameSync nGameSync in nGame.nNGameSyncs)
        {
            if (typeof(NGameDefaultSync).Equals(nGameSync.GetType()))
            {
                nGameDefaultSync = nGameSync as NGameDefaultSync;
            }
        }

        //�Ҳ����򲻴������֡����
        if (nGameDefaultSync == null) return;

        //�ҵ��򽻸� NGameDefaultSync ���� 
        //Loom.QueueOnMainThread(() => {
        //    nGameDefaultSync.SNTick(nFPSInfo);
        //});

        UnityTask.NextTask(() =>
        {
            nGameDefaultSync.SNTick(nFPSInfo);
        });

    }

}
