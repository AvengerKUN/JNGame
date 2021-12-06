using Assets.Game.Script.ngame.ncontroller.service;
using UnityEngine;


public class GameController : MonoBehaviour
{

    public NGameApplication ngame;

    private SNGameUDPAction sNGameUDPAction;

    //点击开启同步事件
    public void onClickSync()
    {

        Debug.Log("onClickSync");

        if (this.sNGameUDPAction == null) this.sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

        //将修改的Position的数值添加到服务器
        sNGameUDPAction.run("nGameSyncStart", new object[] { });

    }

}
