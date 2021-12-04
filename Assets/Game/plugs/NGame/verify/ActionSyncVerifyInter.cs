
using Google.Protobuf;
using System;

public abstract class ActionSyncVerifyInter
{

    //遇到值改变时调用的委托
    public Action updateFun;

    //验证
    public abstract bool Verify();

    //将数据转成 IMessage
    public abstract IMessage ToIMessage();

}
