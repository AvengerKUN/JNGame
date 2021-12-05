

using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.NGame.protobuf;
using UnityEngine;

namespace Assets.Game.Script.ncontroller.service
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
        [NGameRPCMethod]
        public void addSyncInfo(MVector3 vector3)
        {
            Debug.Log("addSyncInfo");
        }

        /**
         * ��ʼ֡ͬ��ģʽ
         */
        [NGameRPCMethod]
        public void nGameSyncStart()
        {
            Debug.Log("nGameSyncStart");
        }

    }
}