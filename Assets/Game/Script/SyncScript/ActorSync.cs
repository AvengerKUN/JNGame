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

    [Header("Actor ������� ID ������NID�����ظ� д����ʾ ����Actor ��д��(0)��̬(1.������Ψһ 2.�ͻ���Ψһ)")]
    public int nId;

    [Header("��ǰ��������Object")]
    public ServerPropEnum nProp;

    /// <summary>
    /// �����ж��Ƿ��Ǳ���ʵ��
    /// </summary>
    [Header("�Ƿ��Ǳ���ʵ��")]
    public bool isLocalActor;

    /// <summary>
    /// �Ƿ��Ƿ�����ʵ��
    /// </summary>
    [Header("�Ƿ��Ƿ���������ʵ��")]
    public bool isServerActor;


    public override void GStart()
    {

        //������ʵ���Ƿ�����������Ĭ�Ͻ����عر�
        if (this.isServerActor)
        {
            this.isLocalActor = false;
        }

        //���û��Id�����ID
        if( this.nId == 0 )
        {
            //����һ��Ψһ��UID
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

        //����һ��������
        ActionVerifyGroup vGroup = new ActionVerifyGroup();

        ActionPositionVerify vPosition = null;
        ActionRotationVerify vRotation = null;
        //����
        vGroup.verifys.Add((vPosition = new ActionPositionVerify(this)));
        vGroup.verifys.Add((vRotation = new ActionRotationVerify(this)));

        vGroup.UpdateFun = () =>
        {
            //������Ǳ��ض����򲻾���ͬ��ͨѶ
            if (!this.isLocalActor) return;

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