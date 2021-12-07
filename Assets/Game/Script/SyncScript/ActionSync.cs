using Assets.Game.plugs.NGame.verify.tools;
using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf.NGameSyncMessage;
using Assets.Game.Script.util.api;
using System.Collections;
using System;
using UnityEngine;
using Assets.Game.Script.util;
using UnityEditor;
using UnityEditor.Experimental.SceneManagement;

public class ActionSync : NGameAction
{

    [Header("Action ������� ID ������NID�����ظ� д����ʾ ����Action ��д��(0)��̬(1.������Ψһ 2.�ͻ���Ψһ)")]
    public int nId;

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

    public override void GUpdate()
    {
    }

}