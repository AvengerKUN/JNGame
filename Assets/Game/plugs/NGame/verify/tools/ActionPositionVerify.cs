using Google.Protobuf;
using UnityEngine;
using Assets.Game.Script.NGame.protobuf;

public class ActionPositionVerify : ActionSyncVerifyInter
{

    //上一次的值
    public Vector3 position;
    public MonoBehaviour action;

    public ActionPositionVerify(MonoBehaviour action)
    {
        this.action = action;
    }

    public override IMessage ToIMessage()
    {
        //将position 转换成 MVector对象返回
        MVector3 vector3 = new MVector3()
        {
            X = position.x,
            Y = position.y,
            Z = position.z,
        };
        return vector3;
    }

    public override bool Verify()
    {

        if (this.position == null) {
            this.position = this.action.transform.position;
            return true;
        }

        bool verify = false;

        if (this.position != this.action.transform.position)
        {
            verify = true;
            //将变化的值覆盖transform
            this.position = this.action.transform.position;
        }

        return verify;
    }
}