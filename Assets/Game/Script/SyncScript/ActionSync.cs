using Assets.Game.plugs.NGame.verify.tools;
using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.util.api;
using UnityEngine;
using Assets.Game.Script.util;
using Assets.Game.Script.util.entity;
using NGame.protobuf;

public class ActionSync : NGameAction
{

    [Header("Action ������� ID ������NID�����ظ� д����ʾ ����Action ��д��(0)��̬(1.������Ψһ 2.�ͻ���Ψһ)")]
    public int nId;

    [Header("��ǰ��������Object")]
    public ServerPropEnum nProp;


    public override void GStart()
    {

        //����һ��Ψһ��UID
        StartCoroutine(
            ServeApi.Get("/open/udp/next", (res) =>
            {

                if (this.nId == 0)
                {
                    NewsContext<int> news = JsonUtility.FromJson<NewsContext<int>>(res);
                    this.nId = news.data;
                    this.initAction();
                }

            })
        );

    }

    public void initAction()
    {

        //����һ��������
        ActionVerifyGroup vGroup = new ActionVerifyGroup();

        ActionPositionVerify vPosition = null;
        //����λ���޸�
        vGroup.verifys.Add((vPosition = new ActionPositionVerify(this)));


        vGroup.UpdateFun = () =>
        {
            //���� SNGameUDPAction ������
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            NAction action = new NAction()
            {
                Uuid = this.nId,
                PropId = (int)this.nProp,
                Pos = vPosition.ToIMessage() as MVector3
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
    public void SNTick(NAction action)
    {

        Debug.Log(string.Format("SNTick: uuid:{0} PropId:{1} pos:{2}.{3}.{4}", action.Uuid, action.PropId, action.Pos.X, action.Pos.Y, action.Pos.Z));

    }

    public override void GUpdate()
    {
    }

}