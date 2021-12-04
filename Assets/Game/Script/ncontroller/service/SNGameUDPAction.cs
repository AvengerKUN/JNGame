

using Assets.Game.Script.NGame.protobuf;
using UnityEngine;

namespace Assets.Game.Script.ncontroller.service
{
    [NGameRPCClass]
    public abstract class SNGameUDPAction
    {
        [NGameRPCMethod,NUIDMode(1)]
        public virtual void nUID(MVector3 vector3)
        {
            Debug.Log("nUID");
        }

        [NGameRPCMethod]
        public virtual void nMethod(MVector3 vector3)
        {
            Debug.Log("nMethod");
        }

        [NGameRPCMethod]
        public virtual void nGameSyncStart()
        {
            Debug.Log("nGameSyncStart");
        }

    }
}