
using Google.Protobuf;
using System;

public abstract class ActionSyncVerifyInter
{

    //����ֵ�ı�ʱ���õ�ί��
    public Action updateFun;

    //��֤
    public abstract bool Verify();

    //������ת�� IMessage
    public abstract IMessage ToIMessage();

}
