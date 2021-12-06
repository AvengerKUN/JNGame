using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf.NGameSyncMessage;
using System;

public class ActionSyncDemo : NGameAction
{
    public override void GStart()
    {


        //����λ���޸�
        ActionPositionVerify actionPositionVerify = new ActionPositionVerify(this);

        actionPositionVerify.UpdateFun = () =>
        {
            //���� SNGameUDPAction ������
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            NAction action = new NAction()
            {
                Uuid = 0,
                Pos = actionPositionVerify.ToIMessage() as MVector3
            };

            //���޸ĵ�Position����ֵ��ӵ�������
            sNGameUDPAction.run("addSyncInfo",new object[] {
                action
            });

        };

        //����֤�����Transform��֤
        this.addVerify(actionPositionVerify);
    }

    public override void GUpdate()
    {
    }

}