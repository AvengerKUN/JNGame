

using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.NGame.protobuf;
using NGame.protobuf;
using UnityEngine;

namespace Assets.Game.Script.ngame.ncontroller.service
{
    [NGameRPCClass]
    public class SNGameUDPAction : NGameRPCIntensifier
    {
        [NGameRPCMethod,NUIDMode(1)]
        public void nUID(MVector3 vector3)
        {
            Debug.Log("nUID");
        }

        [NGameRPCMethod]
        public void nMethod(MVector3 vector3)
        {
            Debug.Log("nMethod");
        }

        /**
         * ����Ϣ��ӵ� nSyncModes ��
         * @param vector3
         */
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_addSyncInfo)]
        public void addSyncInfo(NAction action)
        {
            Debug.Log("addSyncInfo");
        }

        /**
         * ��ʼ֡ͬ��ģʽ
         */
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_nGameSyncStart)]
        public void nGameSyncStart()
        {
            Debug.Log("nGameSyncStart");
        }

        /// <summary>
        /// ��ȡȨ��
        /// </summary>
        /// <param name="owner"></param>
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_nGetActorOwner)]
        public void nGetActorOwner(DActorOwner owner) {
            Debug.Log("nGetActorOwner");
        }

    }
}