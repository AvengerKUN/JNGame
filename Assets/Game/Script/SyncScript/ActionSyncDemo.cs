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
            //���� SNGameUDPAction ������
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;
            sNGameUDPAction.nMethod(actionPositionVerify.ToIMessage() as MVector3);
            sNGameUDPAction.nUID(actionPositionVerify.ToIMessage() as MVector3);
        };

        //����֤�����Transform��֤
        this.addVerify(actionPositionVerify);
    }

    public override void GUpdate()
    {
    }

}