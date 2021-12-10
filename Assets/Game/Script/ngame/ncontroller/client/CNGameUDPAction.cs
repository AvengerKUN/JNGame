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
     * ����֡ͬ��
     */
    [NGameRPCMethod, NUIDMode(ActionRPC.CNGameUDPAction_nGameSyncCallBack)]
    public void nGameSyncCallBack(DSyncInfos nFPSInfo,NGameApplication nGame) {

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

        //������һ֡����
        UnityTask.NextTask(() =>
        {
            nGameDefaultSync.SNTick(nFPSInfo);
        });

        

    }

    /// <summary>
    /// ������Ҹ���Ȩ��
    /// </summary>
    /// <param name="owner"></param>
    [NGameRPCMethod, NUIDMode(ActionRPC.CNGameUDPAction_nUpdateWeight)]
    public void nUpdateWeight(DActorOwner owner, NGameApplication nGame)
    {

        NGameDefaultSync nGameDefaultSync = GetNGameSync(new NGameDefaultSync(), nGame);

        //������һ֡����
        UnityTask.NextTask(() =>
        {
            //���Ӹ�ͬ���ദ��
            nGameDefaultSync.NUpdateActorOwner(owner);
        });

    }

    public T GetNGameSync <T> (T type, NGameApplication nGame) where T : NGameSync
    {

        //����֡ͬ����Ϣ ���� NGameDefaultSync ���� (�ҵ��Ƿ����������ͬ������Class)
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
