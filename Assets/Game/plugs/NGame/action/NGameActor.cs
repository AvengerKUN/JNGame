using Assets.Game.plugs.NGame.sync;
using System;
using System.Collections.Generic;
using UnityEngine;

/**
 * 
 * 这是NGame Action网络类
 * 
 */

namespace Assets.Game.Script.NGame.action
{
    public abstract class NGameActor : MonoBehaviour
    {
        //NGame 网络服务
        public NGameApplication ngame;

        //同步类
        public NGameSync nGameSync;

        //验证集
        public List<ActionSyncVerifyInter> verifys = new List<ActionSyncVerifyInter>();

        public void Start()
        {
            //将当前网络Action 添加到 Application中
            this.ngame.nGameActors.Add(this);
            this.GStart();
        }

        public abstract void GStart();

        public void Update()
        {
            this.GUpdate();
        }
        public abstract void GUpdate();

        //添加验证
        public void addVerify(ActionSyncVerifyInter verify)
        {
            verifys.Add(verify);
        }

    }
}
