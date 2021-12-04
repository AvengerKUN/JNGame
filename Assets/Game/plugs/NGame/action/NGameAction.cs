using DotNetty.Buffers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Assets.Game.Script.NGame.protobuf;
using UnityEngine;
using Google.Protobuf;
using System.Collections;
using Google.Protobuf.WellKnownTypes;

/**
 * 
 * 这是NGame Action网络类
 * 
 */

namespace Assets.Game.Script.NGame.action
{
    public abstract class NGameAction : MonoBehaviour
    {
        //NGame 网络服务
        public NGameApplication ngame;

        //时间+
        private float checkTimeData = 0;
        //服务器帧时间
        private float timeServer = 1 / 1;

        //验证集
        private List<ActionSyncVerifyInter> verifys = new List<ActionSyncVerifyInter>();


        public void Start()
        {
            this.GStart();
        }

        public abstract void GStart();

        public void Update()
        {
            this.GUpdate();

            float dt = Time.deltaTime;
            this.checkTimeData += dt;

            if(this.timeServer < this.checkTimeData)
            {
                this.checkTimeData = 0;

                //调用验证集
                verifys.ForEach(verify => {

                    bool isUpdate = verify.Verify();

                    Debug.Log("verify : " + isUpdate);

                    //如果值有修改则 调用 updateFun
                    if (isUpdate)
                    {
                        if(verify.updateFun != null)
                        {
                            verify.updateFun();
                        }

                        //NGameMessage message = new NGameMessage()
                        //{
                        //    Uid = "nudp-1",
                        //    Message = Any.Pack(actionPositionVerify.ToIMessage())
                        //};

                        ////将消息发送到服务端
                        //this.ngame.SendQueue(Unpooled.WrappedBuffer(message.ToByteArray()));
                    }


                });
            }

        }
        public abstract void GUpdate();

        //添加验证
        public void addVerify(ActionSyncVerifyInter verify)
        {
            verifys.Add(verify);
        }

    }
}
