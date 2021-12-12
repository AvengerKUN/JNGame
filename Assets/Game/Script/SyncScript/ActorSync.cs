using Assets.Game.plugs.NGame.verify.tools;
using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.util.api;
using UnityEngine;
using Assets.Game.Script.util;
using Assets.Game.Script.util.entity;
using NGame.protobuf;
using Assets.Game.Script.SyncScript;
using Assets.Game.Script.plugs;

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
    public bool isOwner;

    /// <summary>
    /// 其他客户端对这个实体的权重程度
    /// </summary>
    public int vOtherWeight;

    /// <summary>
    /// 自己对这个实体的权重程度
    /// </summary>
    public int vOwnWeight;

    public const int MAX_WEIGHT = int.MaxValue;

    /// <summary>
    /// 缓存上一次的权重数
    /// </summary>
    public int vOwnWeightCache;


    public override void GStart()
    {

        switch (this.nSyncMode)
        {
            //如果是客户端模式 ( 分配ID )
            case NSyncMode.Client:
                //创建一个唯一的UID
                StartCoroutine(
                    ServeApi.Get("/open/udp/next", (res) =>
                    {

                        if (this.nId == 0)
                        {
                            this.isOwner = true;
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

        if(this.nSyncMode == NSyncMode.Server)
        {
            this.InitWeight();
        }


    }

    //初始化权重
    public void InitWeight()
    {
        //如果对方权重为 0 则向 服务器要求获取权重
        if (this.vOtherWeight <= 0)
        {
            this.GetActorOwner();
        }
    }

    //获取权限
    public void GetActorOwner()
    {

        //调用 SNGameUDPAction 服务器
        SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

        if (sNGameUDPAction == null) { UnityTask.NextTask(this.GetActorOwner); return; };

        DActorOwner owner = new DActorOwner()
        {
            Uuid = this.nId
        };
        //将修改的Position的数值添加到服务器
        sNGameUDPAction.run("nGetActorOwner", new object[] {
            owner
        });

        //临时将权限设置为最大
        this.vOwnWeightCache = this.vOtherWeight;
        this.vOwnWeight = ActorSync.MAX_WEIGHT;

    }

    //判断是否有控制权限
    public bool isActorControl()
    {
        //如果这个实体拥有者是你 或者 权重你最大
        return this.isOwner || this.vOwnWeight > this.vOtherWeight;
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
            if (!(this.isActorControl())) return;

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