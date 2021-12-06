using Assets.Game.plugs.NGame.sync;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf;
using UnityEngine;

namespace Assets.Game.Script.ngame.nsync
{

    /// <summary>
    /// 同步Class 用于管理同步的事件
    /// </summary>
    public class NGameDefaultSync : NGameSync
    {
        public override void GStart()
        {
        }

        public override void GUpdate()
        {
        }

        //本地验证帧
        public override void NTick()
        {
            //获取所有需要同步的Action进行验证 验证集
            foreach (NGameAction action in this.nGame.nGameActions)
            {

                foreach (ActionSyncVerifyInter verify in action.verifys)
                {

                    bool isUpdate = verify.Verify();

                    //如果值有修改则 调用 UpdateFun 委托
                    if (isUpdate)
                    {
                        if (verify.UpdateFun != null)
                        {
                            verify.UpdateFun();
                        }
                    }
                }

            }
        }

        /// <summary>
        /// 网络帧 处理
        /// </summary>
        public void SNTick(AnyArray nFPSInfo) {

            Debug.Log(string.Format("SNTick {0}", nFPSInfo.Message.Count));
        
        }
    }
}
