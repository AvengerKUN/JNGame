using Google.Protobuf;
using NGame.protobuf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Game.plugs.NGame.verify.tools
{
    /// <summary>
    /// 监听旋转
    /// </summary>
    class ActionRotationVerify : ActionSyncVerifyInter
    {

        //上一次的值
        public Vector3 position;
        public MonoBehaviour action;
        //上一次验证的bool
        public bool lastVerify;

        public ActionRotationVerify(MonoBehaviour action)
        {
            this.action = action;
        }

        public override IMessage ToIMessage()
        {
            //将position 转换成 MVector对象返回
            MVector3 vector3 = new MVector3()
            {
                X = position.x,
                Y = position.y,
                Z = position.z,
            };
            return vector3;
        }

        public override bool Verify()
        {
            if (this.position == null)
            {
                this.position = this.action.transform.rotation.eulerAngles;
                return true;
            }

            bool verify = false;

            if (this.position != this.action.transform.rotation.eulerAngles)
            {
                verify = true;
                //将变化的值覆盖transform
                this.position = this.action.transform.rotation.eulerAngles;
            }

            this.lastVerify = verify;

            return verify;
        }
    }
}
