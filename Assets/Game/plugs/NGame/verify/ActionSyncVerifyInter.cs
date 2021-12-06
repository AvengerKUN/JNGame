
using Google.Protobuf;
using System;

public abstract class ActionSyncVerifyInter
{


    //Action属性更新委托
    public Action UpdateFun;

    //验证
    public abstract bool Verify();

    //将数据转成 IMessage
    public abstract IMessage ToIMessage();

}
