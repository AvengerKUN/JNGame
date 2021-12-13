

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
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_addSyncInfo)]
        public void addSyncInfo(NAction action)
        {
            Debug.Log("addSyncInfo");
        }

        /**
         * 开始帧同步模式
         */
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_nGameSyncStart)]
        public void nGameSyncStart()
        {
            Debug.Log("nGameSyncStart");
        }

        /// <summary>
        /// 获取权限
        /// </summary>
        /// <param name="owner"></param>
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_nGetActorOwner)]
        public void nGetActorOwner(DActorOwner owner) {
            Debug.Log("nGetActorOwner");
        }

        /// <summary>
        /// 强制获取Actor权限
        /// </summary>
        /// <param name="owner"></param>
        [NGameRPCMethod, NUIDMode(ActionRPC.SNGameUDPAction_nGetForceActorOwner)]
        public void nGetForceActorOwner(DActorOwner owner)
        {
            Debug.Log("nGetForceActorOwner");
        }

    }
}