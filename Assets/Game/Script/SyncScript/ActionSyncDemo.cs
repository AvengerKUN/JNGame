using Assets.Game.Script.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf;
using DotNetty.Buffers;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ActionSyncDemo : NGameAction
{
    public override void GStart()
    {

        ActionPositionVerify actionPositionVerify = new ActionPositionVerify(this);

        actionPositionVerify.updateFun = () =>
        {
            //调用 SNGameUDPAction 服务器
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;
            sNGameUDPAction.nMethod(actionPositionVerify.ToIMessage() as MVector3);
            sNGameUDPAction.nUID(actionPositionVerify.ToIMessage() as MVector3);
        };

        //向验证集添加Transform验证
        this.addVerify(actionPositionVerify);
    }

    public override void GUpdate()
    {
    }

}