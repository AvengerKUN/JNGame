using Assets.Game.plugs.NGame.sync;
using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.NGame.action;
using Assets.Game.Script.NGame.protobuf;
using Google.Protobuf;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Threading;
using UnityEngine;

/**
 
����NGame������Class
 
 */
public class NGameApplication : MonoBehaviour
{

    public string IP = null;
    public int Port = 1000;
    public int aliveTime = 1000; //����ʱ��

    private Queue<byte[]> queue; //��Ϣ���Ͷ���
    private bool IsRunQueue = false;

    //���� NGameRPCClass �� Attribute ��
    public Dictionary<string, NGameRPCIntensifier> rClass = new Dictionary<string, NGameRPCIntensifier>();
    //�������з���
    public Dictionary<string, MethodInfo> rMethods = new Dictionary<string, MethodInfo>();
    //��ǰNGame���������NGameAction������
    public List<NGameActor> nGameActors = new List<NGameActor>();
    //��ǰNGame���������NGameSyncͬ����
    public List<NGameSync> nNGameSyncs = new List<NGameSync>();


    private IPEndPoint ipSend; //������IP
    private IPEndPoint ipReceive; //�Լ���IP
    private Socket socketReceive; //���յ���������
    private Thread connectThread; //�������ݵ��߳�
    private Timer aliveTimer; //���������߳�


    // Start is called before the first frame update
    void Start()
    {
        this.InitNetwork();
        Type[] types = AttributeUtil.GetAllSystemAttributeClass(typeof(NGameRPCClass));

        Debug.Log(string.Format("�ҵ� NGameRPCClass �� : {0}", types.Length));

        //��ʼ�� types �е� �� ΪRPC��
        foreach (Type t in types)
        {

            if (t.IsSubclassOf(typeof(NGameRPCIntensifier)))
            {
                NGameRPCIntensifier v = this.NewRPCClass(Activator.CreateInstance(t) as NGameRPCIntensifier);
                rClass.Add(t.Name, v);
                this.AddRPCMethod(t, v);
            };
        }

    }

    //ͨ�����ͷ���rClass�е���
    public object GetRClass(Type t)
    {
        if (this.rClass.ContainsKey(t.Name))
        {
            return this.rClass[t.Name];
        }
        return null;
    }


    //��ʼ������
    void InitNetwork()
    {


        //�������ӵķ�����ip�Ͷ˿ڣ������Ǳ���ip����������������
        ipSend = new IPEndPoint(IPAddress.Parse(this.IP), this.Port);

        //�������� ���н��� ����
        //���������˿�,�����κ�IP
        ipReceive = new IPEndPoint(IPAddress.Any, 0);

        //�����׽�������,�����߳��ж���
        socketReceive = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        //�������Ҫ��ip
        socketReceive.Bind(ipReceive);

        //����һ���߳����ӣ�����ģ��������߳̿���
        connectThread = new Thread(new ThreadStart(SocketReceive));
        connectThread.Start();
        //��������
        //aliveThread = new Thread(new ThreadStart(UDPAlive));
        //aliveThread.Start();
        aliveTimer = new Timer(new TimerCallback((o) => { this.UDPAlive(); }),this,0,this.aliveTime);

        Debug.Log("��ʼ�� UDP Client �ɹ�");

    }


    /// <summary>
    /// �������������������
    /// </summary>
    public void UDPAlive()
    {
        //����������Ϳ�����
        this.SendQueue((new NGameMessage()).ToByteArray());
    }

    /// <summary>
    /// ѭ����������
    /// </summary>
    public void SocketReceive()
    {
        byte[] recvData;
        byte[] buffer;
        int recvLen;

        //�������ѭ��
        while (true)
        {
            //��data����
            recvData = new byte[1024];
            EndPoint endPoint = (ipReceive as EndPoint);
            //��ȡ�ͻ��ˣ���ȡ�ͻ������ݣ������ø��ͻ��˸�ֵ
            recvLen = socketReceive.ReceiveFrom(recvData, ref endPoint);

            Debug.Log("���յ���Ϣ: " + recvLen); //��ӡ��Ϣ

            buffer = new byte[recvLen];
            Array.Copy(recvData, buffer, recvLen);

            this.onMessage(buffer);

        }
    }

    void SocketSend(byte[] sends)
    {
        //���͸����з����
        socketReceive.SendTo(sends, ipSend);
    }

    private NGameRPCIntensifier NewRPCClass(NGameRPCIntensifier type)
    {

        //ͨ��RPC ��ǿ�� ��ʼ������
        //ProxyGenerator generator = new ProxyGenerator();
        //object v = generator.CreateClassProxy(type,new NGameRPCIntensifier(this));
        //return v;

        type.nGame = this;
        return type;
    }

    private void AddRPCMethod(Type t,object v)
    {
        MethodInfo[] methods = v.GetType().GetMethods();

        foreach (MethodInfo method in methods)
        {
            if(method.GetCustomAttribute(typeof(NGameRPCMethod)) != null)
            {
                NUIDMode uidMode = null;
                //�ж��Ƿ���� NUIDMode ע��
                if ((uidMode = method.GetCustomAttribute<NUIDMode>()) != null)
                {
                    rMethods.Add(uidMode.uuid.ToString(), method);
                }
                else
                {
                    rMethods.Add(string.Format("{0}-{1}", t.Name, method.Name), method);
                }

            }
        }

    }

    /**
     * ���з�����Ϣ �����Ϊ����δ���� ���� ����д ����뵽������
     */

    public void SendQueue(byte[] buffer)
    {
        if (this.queue == null) this.queue = new Queue<byte[]>();
        //�������
        if (buffer != null) this.queue.Enqueue(buffer);


        if (this.socketReceive != null && !this.IsRunQueue)
        {

            //����������״̬����TRUE
            this.IsRunQueue = true;
            byte[] send = null;


            //�������е�����ȡ�����з���
            try
            {
                while ((send = this.queue.Dequeue()) != null)
                {
                    Debug.Log("���������������:" + buffer.Length);
                    this.SocketSend(send);
                }
            }
            catch (Exception) { }


            //�����򽫶�������״̬����FLASE
            this.IsRunQueue = false;
        }

    }

    //ͳһ������Ϣ
    public void onMessage(byte[] buffer)
    {

        //��byte ת NGameMessage ����
        NGameMessage nGameMessage = NGameMessage.Parser.ParseFrom(buffer);

        //RPC ������
        MethodInfo method = null;

        //�ҵ����õķ���
        string key = null;

        if (nGameMessage.Uid != 0)
        {
            key = nGameMessage.Uid.ToString();
        }
        else
        {
            key = string.Format("{0}-{1}", nGameMessage.Action, nGameMessage.Event);
        }

        if (this.rMethods.ContainsKey(key))
        {
            method = this.rMethods[key];
        }

        //�ж��Ƿ��ҵ��������û���򷵻�
        if (method == null) return;

        //�����������
        ParameterInfo[] argsType = method.GetParameters();
        object[] args = new object[argsType.Length];

        //�ҵ���������args
        for (int i = 0; i < argsType.Length; i++)
        {
            //Ĭ��ֵΪ��
            args[i] = null;

            //�жϲ����Ƿ�����Protobuf �� IMessage
            if (typeof(IMessage).IsAssignableFrom(argsType[i].ParameterType))
            {

                MethodInfo methodInfo = nGameMessage.Message.GetType().GetMethod("Unpack");
                methodInfo = methodInfo.MakeGenericMethod(argsType[i].ParameterType);

                args[i] = methodInfo.Invoke(nGameMessage.Message,new object[] { });

            }

            //�жϲ����Ƿ���ҪNGameApplication 
            if (typeof(NGameApplication).IsAssignableFrom(argsType[i].ParameterType))
            {
                args[i] = this;
            }


        }


        //�ҵ����������Object
        method.Invoke(this.GetRClass(method.ReflectedType),args);
        
    }


    //���ӹر�
    void OnApplicationQuit()
    {
        //�ر��߳�
        if (connectThread != null)
        {
            connectThread.Interrupt();
            connectThread.Abort();
            aliveTimer.Dispose();
        }
        //���ر�socket
        if (socketReceive != null)
            socketReceive.Close();
    }

}
