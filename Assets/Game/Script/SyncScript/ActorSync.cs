using Assets.Game.plugs.NGame.verify.tools;
using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.util.api;
using UnityEngine;
using Assets.Game.Script.util;
using Assets.Game.Script.util.entity;
using NGame.protobuf;

public class ActorSync : NGameActor
{

    [Header("Actor 在网络的 ID 场景中NID不能重复 写死表示 场景Actor 不写死(0)则动态(1.服务器唯一 2.客户端唯一)")]
    public int nId;

    [Header("当前关联网络Object")]
    public ServerPropEnum nProp;

    /// <summary>
    /// 用来判断是否是本地实体
    /// </summary>
    [Header("是否是本地实体")]
    public bool isLocalActor;

    /// <summary>
    /// 是否是服务器实体
    /// </summary>
    [Header("是否是服务器管理实体")]
    public bool isServerActor;


    public override void GStart()
    {

        //如果这个实体是服务器管理则默认将本地关闭
        if (this.isServerActor)
        {
            this.isLocalActor = false;
        }

        //如果没有Id则分配ID
        if( this.nId == 0 )
        {
            //创建一个唯一的UID
            StartCoroutine(
                ServeApi.Get("/open/udp/next", (res) =>
                {

                    if (this.nId == 0)
                    {
                        NewsContext<int> news = JsonUtility.FromJson<NewsContext<int>>(res);
                        this.nId = news.data;
                        this.initActor();
                    }

                })
            );
        }
        else
        {
            this.initActor();
        }

    }

    public void initActor()
    {

        //创建一个监听组
        ActionVerifyGroup vGroup = new ActionVerifyGroup();

        ActionPositionVerify vPosition = null;
        ActionRotationVerify vRotation = null;
        //监听
        vGroup.verifys.Add((vPosition = new ActionPositionVerify(this)));
        vGroup.verifys.Add((vRotation = new ActionRotationVerify(this)));

        vGroup.UpdateFun = () =>
        {
            //如果不是本地对象则不就行同步通讯
            if (!this.isLocalActor) return;

            //调用 SNGameUDPAction 服务器
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            NAction action = new NAction()
            {
                Uuid = this.nId,
                PropId = (int)this.nProp,
                Pos = vPosition.lastVerify ? vPosition.ToIMessage() as MVector3 : null,
                Rot = vRotation.lastVerify ? vRotation.ToIMessage() as MVector3 : null
            };

            //将修改的Position的数值添加到服务器
            sNGameUDPAction.run("addSyncInfo", new object[] {
                action
            });

        };

        //向验证集添加Transform验证
        this.addVerify(vGroup);

    }


    //接收服务器帧通知 (仅限当前UUID的帧)
    public virtual void SNTick(NAction action) { }

    public override void GUpdate()
    {
    }

}