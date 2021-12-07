using Assets.Game.plugs.NGame.sync;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf;
using NGame.protobuf;
using System.Collections.Generic;
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

            //获取 NGame 中所有 ActionSync
            List<NGameAction> nGameActions = this.nGame.nGameActions.FindAll((action) => {
                return typeof(ActionSync).IsAssignableFrom(action.GetType());
            });

            //循环处理帧数据
            for (int i = 0; i < nFPSInfo.Message.Count; i++)
            {

                //将Message转换NAction
                NAction nAction = nFPSInfo.Message[i].Unpack<NAction>();

                ActionSync actionSync = null;
                //在已知的库中找到Action
                foreach (ActionSync nGameAction in nGameActions)
                {
                    if (nGameAction.nId.Equals(nAction.Uuid))
                    {
                        //找到则赋值
                        actionSync = nGameAction;
                        break;
                    }
                }

                //找到则调用ActionSync SNTick 没有找到则调用 生成对象
                if (actionSync != null) actionSync.SNTick(nAction);
                else this.NCreateAction(nAction);


            }

        }

        /// <summary>
        /// 如果找不到Action则生成
        /// </summary>
        public void NCreateAction(NAction nAction)
        {
            Debug.Log("NCreateAction");
        }

    }
}
