
using Google.Protobuf;
using System;

public abstract class ActionSyncVerifyInter
{


    //Action���Ը���ί��
    public Action UpdateFun;

    //��֤
    public abstract bool Verify();

    //������ת�� IMessage
    public abstract IMessage ToIMessage();

}
