using NGame.protobuf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.Script.SyncScript.player
{
    class NPlayerSync : ActionSync
    {

        private CharacterController controller;

        //对方同步位置(不是本地生效)
        private Vector3 nPos = Vector3.zero;
        private Vector3 nLPos = Vector3.zero;
        //移动当前时间
        private float nTime = 0;

        public override void GStart()
        {
            base.GStart();
        }

        public override void GUpdate()
        {
            base.GUpdate();

            this.UpdateSync();

        }

        /// <summary>
        /// 同步更新(不是本地生效)
        /// </summary>
        public void UpdateSync()
        {
            if (this.isLocalAction) return;

            this.nTime += Time.deltaTime;
            this.transform.position = Vector3.Lerp(nLPos, nPos, this.nTime / nGameSync.timeServer);

        }

        public override void SNTick(NAction action)
        {
            //如果是本地控制则不受同步
            if (this.isLocalAction) return;

            //如果没有 controller 则获取

            base.SNTick(action);
            //移动物体
            this.nTime = 0;
            this.nLPos = this.transform.position;
            nPos = new Vector3(action.Pos.X, action.Pos.Y, action.Pos.Z);

        }
    }
}
