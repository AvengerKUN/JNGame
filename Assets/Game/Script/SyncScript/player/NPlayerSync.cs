using NGame.protobuf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.Script.SyncScript.player
{
    class NPlayerSync : ActorSync
    {

        private CharacterController controller;

        //网络帧队列
        private Queue<NAction> nTickQuery = new Queue<NAction>();
        //本地网络帧时间
        private float nTickTime = 0;

        //同步位置(不是本地生效)
        private Vector3 nPos = Vector3.zero;
        private Vector3 nLPos = Vector3.zero;
        //同步旋转(不是本地生效)
        private Quaternion nRot = Quaternion.identity;
        private Quaternion nLRot = Quaternion.identity;
        //移动当前时间
        private float nTime = 0;

        public override void GStart()
        {
            base.GStart();
        }

        public override void GUpdate()
        {
            base.GUpdate();

            //更新网络帧数
            this.NUpdateTick();

            this.UpdateSync();

        }

        /// <summary>
        /// 同步更新(不是本地生效)
        /// </summary>
        public void UpdateSync()
        {
            if (this.nSyncMode == NSyncMode.Client) return;

            this.nTime += Time.deltaTime;
            this.transform.position = Vector3.Lerp(nLPos, nPos, this.nTime / nGameSync.timeServer);

            this.transform.rotation = Quaternion.Lerp(nLRot, nRot, this.nTime / nGameSync.timeServer);


            if ((this.nTime / nGameSync.timeServer) >= 1) {
                nLPos = nPos;
                nLRot = nRot;
            };

        }

        private void NUpdateTick()
        {

            this.nTickTime += Time.deltaTime;

            if (this.nTickTime >= nGameSync.timeServer)
            {
                this.nTickTime -= nGameSync.timeServer;

                NAction action = null;
                //如果没有网络帧处理则返回
                if (!(nTickQuery.Count > 0) || ((action = nTickQuery.Dequeue()) == null)) return;

                this.nTime = 0;

                //移动物体
                if (action.Pos != null)
                {
                    this.nLPos = this.transform.position;
                    nPos = new Vector3(action.Pos.X, action.Pos.Y, action.Pos.Z);
                }

                //旋转物体
                if(action.Rot != null)
                {
                    this.nLRot = this.transform.rotation;
                    nRot = Quaternion.Euler(action.Rot.X, action.Rot.Y, action.Rot.Z);
                }

                Debug.Log(nRot);

            }

        }

        public override void SNTick(NAction action)
        {
            //如果是本地控制则不受同步
            if (this.nSyncMode == NSyncMode.Client) return;

            this.nTickQuery.Enqueue(action);

        }
    }
}
