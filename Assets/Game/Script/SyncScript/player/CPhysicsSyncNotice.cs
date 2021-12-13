using Assets.Game.Script.SyncScript.player;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CPhysicsSyncNotice : MonoBehaviour
{

    //通知物理同步类
    public NPhysicsSync sync;


    private void OnCollisionEnter(Collision collision) {
        if (sync != null)
        {
            sync.OnCollisionEnter(collision);
        }
    }


}
