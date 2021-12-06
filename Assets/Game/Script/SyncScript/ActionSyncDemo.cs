using Assets.Game.Script.ngame.ncontroller.service;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf.NGameSyncMessage;
using System;

public class ActionSyncDemo : NGameAction
{
    public override void GStart()
    {


        //监听位置修改
        ActionPositionVerify actionPositionVerify = new ActionPositionVerify(this);

        actionPositionVerify.UpdateFun = () =>
        {
            //调用 SNGameUDPAction 服务器
            SNGameUDPAction sNGameUDPAction = this.ngame.GetRClass(typeof(SNGameUDPAction)) as SNGameUDPAction;

            NAction action = new NAction()
            {
                Uuid = 0,
                Pos = actionPositionVerify.ToIMessage() as MVector3
            };

            //将修改的Position的数值添加到服务器
            sNGameUDPAction.run("addSyncInfo",new object[] {
                action
            });

        };

        //向验证集添加Transform验证
        this.addVerify(actionPositionVerify);
    }

    public override void GUpdate()
    {
    }

}