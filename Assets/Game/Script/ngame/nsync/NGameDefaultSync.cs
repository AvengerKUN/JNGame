using Assets.Game.plugs.NGame.sync;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf;
using Assets.Game.Script.plugs;
using Assets.Game.Script.SyncScript;
using Assets.Game.Script.util.entity;
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

        /// <summary>
        /// 同步世界
        /// </summary>
        [Header("同步世界节点 默认同步时动态添加在这个世界节点中")]
        public GameObject SyncWorld;

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
            foreach (NGameActor action in this.nGame.nGameActors)
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
        public void SNTick(DSyncInfos nFPSInfo) {

            //获取 NGame 中所有 ActionSync
            List<NGameActor> nGameActions = this.nGame.nGameActors.FindAll((action) => {
                return typeof(ActorSync).IsAssignableFrom(action.GetType());
            });

            //循环处理帧数据
            for (int i = 0; i < nFPSInfo.Message.Count; i++)
            {

                //将Message转换NAction
                NAction nAction = nFPSInfo.Message[i].Unpack<NAction>();

                ActorSync actionSync = null;
                //在已知的库中找到Action
                foreach (ActorSync nGameAction in nGameActions)
                {

                    if (nGameAction.nId == nAction.Uuid)
                    {
                        //找到则赋值
                        actionSync = nGameAction;
                        break;
                    }
                }


                ////没有ActionSync则生成
                if (actionSync == null) {
                    actionSync = this.NCreateAction(nAction).GetComponent<ActorSync>();
                    if (actionSync != null)
                    {
                        actionSync.ngame = this.nGame;
                        actionSync.nProp = (ServerPropEnum)nAction.PropId;
                        actionSync.nId = nAction.Uuid;
                        actionSync.nSyncMode = NSyncMode.Other;
                        actionSync.isOwner = false;
                        actionSync.nGameSync = this;
                    }
                    nGameActions.Add(actionSync);
                }

                //找到则调用 ActionSync SNTick 没有找到则调用 生成对象
                if (actionSync != null)
                {

                    Debug.Log("SNTick");

                    //执行同步帧
                    actionSync.SNTick(nAction);
                }

            }

        }

        /// <summary>
        /// 统一更新Actor权限
        /// </summary>
        public void NUpdateActorOwner(DActorOwner owner)
        {
            Debug.Log("NUpdateActorOwner");

            //获取 NGame 中所有 ActionSync
            List<NGameActor> nGameActions = this.nGame.nGameActors.FindAll((action) => {
                return typeof(ActorSync).IsAssignableFrom(action.GetType());
            });

            ActorSync actionSync = null;

            //找到 Actor 然后修改权重
            foreach (NGameActor actor in nGameActions)
            {
                actionSync = actor.GetComponent<ActorSync>();

                if (actionSync != null && actionSync.nId == owner.Uuid)
                    break;
                else
                    actionSync = null;

            }

            //如果场景找不到这个对象暂时不处理
            if (actionSync == null) return;

            //赋值权重
            if (owner.IsOwn)
            {
                actionSync.vOwnWeight = owner.Owner;
            }
            else {
                actionSync.vOwnWeight = 0;
                actionSync.vOtherWeight = owner.Owner;
            }

        }

        /// <summary>
        /// 如果找不到Action则生成
        /// </summary>
        public GameObject NCreateAction(NAction nAction)
        {

            Debug.Log(string.Format("场景中没有{0} 进行生成.", nAction.Uuid));

            GameObject nPrefar = null;

            //获取预制体
            if ((nPrefar = ServerPropQuery.QueryPrefar((ServerPropEnum)nAction.PropId)) == null) return null;

            //生成GameObject
            GameObject wObject = Instantiate(nPrefar, this.SyncWorld.transform);

            return wObject;
        }

    }
}
