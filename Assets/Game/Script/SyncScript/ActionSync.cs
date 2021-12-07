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

    [Header("Action 在网络的 ID 场景中NID不能重复 写死表示 场景Action 不写死(0)则动态(1.服务器唯一 2.客户端唯一)")]
    public int nId;

    public override void GStart()
    {

        //创建一个唯一的UID
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

        //创建一个监听组
        ActionVerifyGroup vGroup = new ActionVerifyGroup();

        ActionPositionVerify vPosition = null;
        //监听位置修改
        vGroup.verifys.Add((vPosition = new ActionPositionVerify(this)));


        vGroup.UpdateFun = () =>
        {
            //调用 SNGameUDPAction 服务器
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            NAction action = new NAction()
            {
                Uuid = this.nId,
                Pos = vPosition.ToIMessage() as MVector3
            };

            //将修改的Position的数值添加到服务器
            sNGameUDPAction.run("addSyncInfo", new object[] {
                action
            });

        };

        //向验证集添加Transform验证
        this.addVerify(vGroup);

    }

    public override void GUpdate()
    {
    }

}