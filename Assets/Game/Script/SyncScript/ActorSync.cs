using Assets.Game.plugs.NGame.verify.tools;
using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.util.api;
using UnityEngine;
using Assets.Game.Script.util;
using Assets.Game.Script.util.entity;
using NGame.protobuf;
using Assets.Game.Script.SyncScript;

public class ActorSync : NGameActor
{

    [Header("Actor 在网络的 ID 场景中NID不能重复 写死表示 场景Actor 不写死(0)则动态(1.服务器唯一 2.客户端唯一)")]
    public int nId;

    [Header("当前关联网络Object")]
    public ServerPropEnum nProp;

    [Header("同步模式")]
    public NSyncMode nSyncMode;

    /// <summary>
    /// 是否是这个物体的拥有者
    /// </summary>
    private bool isOwner;


    public override void GStart()
    {

        switch (this.nSyncMode)
        {
            //如果是客户端模式 ( 分配ID )
            case NSyncMode.Client:
                this.isOwner = true;
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
                break;
            //服务器模式
            case NSyncMode.Server:
            //对方模式
            case NSyncMode.Other:

                if (this.nId != 0)
                {
                    this.initActor();
                }

                break;
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
            //如果不是本地控制则不就行同步通讯
            if (!(this.isOwner)) return;

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