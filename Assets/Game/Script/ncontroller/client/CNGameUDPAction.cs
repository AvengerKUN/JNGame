using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.NGame.protobuf;
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
    public void nGameSyncCallBack(AnyArray nFPSInfo) {

        Debug.Log(string.Format("CNGameUDPAction - nGameSyncCallBack {0}", nFPSInfo.Message.Count));
    
    }

}
