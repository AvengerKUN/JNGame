using Assets.Game.Script.SyncScript.player;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CPhysicsSyncNotice : MonoBehaviour
{

    //֪ͨ����ͬ����
    public NPhysicsSync sync;


    private void OnCollisionEnter(Collision collision) {
        if (sync != null)
        {
            sync.OnCollisionEnter(collision);
        }
    }


}
