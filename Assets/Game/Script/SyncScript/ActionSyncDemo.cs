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
            //调用 SNGameUDPAction 服务器
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            //将修改的Position的数值添加到服务器
            sNGameUDPAction.run("addSyncInfo",new object[] {
                actionPositionVerify.ToIMessage() as MVector3
            });

        };

        //向验证集添加Transform验证
        this.addVerify(actionPositionVerify);
    }

    public override void GUpdate()
    {
    }

}