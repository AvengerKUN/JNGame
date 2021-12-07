

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
         * 将消息添加到 nSyncModes 中
         * @param vector3
         */
        [NGameRPCMethod]
        public void addSyncInfo(NAction action)
        {
            Debug.Log("addSyncInfo");
        }

        /**
         * 开始帧同步模式
         */
        [NGameRPCMethod]
        public void nGameSyncStart()
        {
            Debug.Log("nGameSyncStart");
        }

    }
}