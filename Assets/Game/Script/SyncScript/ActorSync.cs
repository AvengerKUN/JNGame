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

    [Header("Actor ������� ID ������NID�����ظ� д����ʾ ����Actor ��д��(0)��̬(1.������Ψһ 2.�ͻ���Ψһ)")]
    public int nId;

    [Header("��ǰ��������Object")]
    public ServerPropEnum nProp;

    [Header("ͬ��ģʽ")]
    public NSyncMode nSyncMode;

    /// <summary>
    /// �Ƿ�����������ӵ����
    /// </summary>
    public bool isOwner;

    /// <summary>
    /// �����ͻ��˶����ʵ���Ȩ�س̶�
    /// </summary>
    public int vOtherWeight;

    /// <summary>
    /// �Լ������ʵ���Ȩ�س̶�
    /// </summary>
    public int vOwnWeight;

    public const int MAX_WEIGHT = int.MaxValue;

    /// <summary>
    /// ������һ�ε�Ȩ����
    /// </summary>
    public int vOwnWeightCache;


    public override void GStart()
    {

        switch (this.nSyncMode)
        {
            //����ǿͻ���ģʽ ( ����ID )
            case NSyncMode.Client:
                //����һ��Ψһ��UID
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
            //������ģʽ
            case NSyncMode.Server:
            //�Է�ģʽ
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

    //��ʼ��Ȩ��
    public void InitWeight()
    {
        //����Է�Ȩ��Ϊ 0 ���� ������Ҫ���ȡȨ��
        if (this.vOtherWeight <= 0)
        {
            this.GetActorOwner();
        }
    }

    //��ȡȨ��
    public void GetActorOwner()
    {

        //���� SNGameUDPAction ������
        SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

        if (sNGameUDPAction == null) { UnityTask.NextTask(this.GetActorOwner); return; };

        DActorOwner owner = new DActorOwner()
        {
            Uuid = this.nId
        };
        //���޸ĵ�Position����ֵ��ӵ�������
        sNGameUDPAction.run("nGetActorOwner", new object[] {
            owner
        });

        //��ʱ��Ȩ������Ϊ���
        this.vOwnWeightCache = this.vOtherWeight;
        this.vOwnWeight = ActorSync.MAX_WEIGHT;

    }

    //�ж��Ƿ��п���Ȩ��
    public bool isActorControl()
    {
        //������ʵ��ӵ�������� ���� Ȩ�������
        return this.isOwner || this.vOwnWeight > this.vOtherWeight;
    }

    public void initActor()
    {

        //����һ��������
        ActionVerifyGroup vGroup = new ActionVerifyGroup();

        ActionPositionVerify vPosition = null;
        ActionRotationVerify vRotation = null;
        //����
        vGroup.verifys.Add((vPosition = new ActionPositionVerify(this)));
        vGroup.verifys.Add((vRotation = new ActionRotationVerify(this)));

        vGroup.UpdateFun = () =>
        {

            //������Ǳ��ؿ����򲻾���ͬ��ͨѶ
            if (!(this.isActorControl())) return;

            //���� SNGameUDPAction ������
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            NAction action = new NAction()
            {
                Uuid = this.nId,
                PropId = (int)this.nProp,
                Pos = vPosition.lastVerify ? vPosition.ToIMessage() as MVector3 : null,
                Rot = vRotation.lastVerify ? vRotation.ToIMessage() as MVector3 : null
            };

            //���޸ĵ�Position����ֵ��ӵ�������
            sNGameUDPAction.run("addSyncInfo", new object[] {
                action
            });

        };

        //����֤�����Transform��֤
        this.addVerify(vGroup);

    }


    //���շ�����֪֡ͨ (���޵�ǰUUID��֡)
    public virtual void SNTick(NAction action) { }

    public override void GUpdate()
    {
    }

}