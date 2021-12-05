using Assets.Game.Script.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf;
using System;

public class ActionSyncDemo : NGameAction
{
    public override void GStart()
    {

        ActionPositionVerify actionPositionVerify = new ActionPositionVerify(this);

        actionPositionVerify.updateFun = () =>
        {
            //���� SNGameUDPAction ������
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            //���޸ĵ�Position����ֵ��ӵ�������
            sNGameUDPAction.run("addSyncInfo",new object[] {
                actionPositionVerify.ToIMessage() as MVector3
            });

        };

        //����֤�����Transform��֤
        this.addVerify(actionPositionVerify);
    }

    public override void GUpdate()
    {
    }

}