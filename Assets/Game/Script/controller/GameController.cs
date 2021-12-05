using Assets.Game.Script.ncontroller.service;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;


public class GameController : MonoBehaviour
{

    public NGameApplication ngame;

    private SNGameUDPAction sNGameUDPAction;

    //�������ͬ���¼�
    public void onClickSync()
    {

        Debug.Log("onClickSync");

        if (this.sNGameUDPAction == null) this.sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

        //���޸ĵ�Position����ֵ��ӵ�������
        sNGameUDPAction.run("nGameSyncStart", new object[] { });

    }

}
