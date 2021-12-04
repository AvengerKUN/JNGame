using Assets.Game.plugs.NGame.tools;
using Assets.Game.Script.NGame.network.handler;
using Castle.DynamicProxy;
using DotNetty.Buffers;
using DotNetty.Transport.Bootstrapping;
using DotNetty.Transport.Channels;
using DotNetty.Transport.Channels.Sockets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using UnityEngine;


/**
 
����NGame������Class
 
 */
public class NGameApplication : MonoBehaviour
{

    public string IP = null;
    public int Port = 1000;

    private IEventLoopGroup group;
    private Bootstrap bootstrap;
    public IChannel channel;

    private Queue<IByteBuffer> queue;
    private bool IsRunQueue = false;

    //���� NGameRPCClass �� Attribute ��
    public Dictionary<string, object> rClass = new Dictionary<string, object>();
    //�������з���
    public Dictionary<string, MethodInfo> rMethods = new Dictionary<string, MethodInfo>();


    // Start is called before the first frame update
    void Start()
    {

        this.InitNetwork();
        Type[] types = AttributeUtil.GetAllSystemAttributeClass(typeof(NGameRPCClass));

        //��ʼ�� types �е� �� ΪRPC��
        foreach (Type t in types)
        {
            object v = this.NewRPCClass(t);
            rClass.Add(t.Name, v);
            this.AddRPCMethod(t, v);
        }

        //ProxyGenerator generator = new ProxyGenerator();
        //SNGameUDPAction entity = generator.CreateClassProxy<SNGameUDPAction>(new NGameRPCIntensifier());

        //entity.nMethod();

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

    async void InitNetwork()
    {

        //����UDP �ͻ���
        this.group = new MultithreadEventLoopGroup();
        bootstrap = new Bootstrap();

        bootstrap
            .Group(group)
            .ChannelFactory(() => new SocketDatagramChannel(AddressFamily.InterNetwork))
            .Handler(new ActionChannelInitializer<IChannel>((channel) =>
            {
                Debug.Log("�����ͻ��˳ɹ�");
                //��ʼ��UDP NGame
                channel.Pipeline.AddLast(new InitNGameHandler());
            }));

        //����UDP
        this.channel = await bootstrap.BindAsync(0);

        this.SendQueue(null);
    }

    private object NewRPCClass(Type type)
    {

        //ͨ��RPC ��ǿ�� ��ʼ������
        ProxyGenerator generator = new ProxyGenerator();
        object v = generator.CreateClassProxy(type,new NGameRPCIntensifier(this));
        return v;

    }

    private void AddRPCMethod(Type t,object v)
    {
        MethodInfo[] methods = v.GetType().GetMethods();

        foreach (MethodInfo method in methods)
        {
            if(method.GetCustomAttribute(typeof(NGameRPCMethod)) != null)
            {
                rMethods.Add(string.Format("{0}-{1}", t.Name, method.Name), method);
            }
        }

    }

    /**
     * ���з�����Ϣ �����Ϊ����δ���� ���� ����д ����뵽������
     */

    public void SendQueue(IByteBuffer buffer)
    {
        if (this.queue == null) this.queue = new Queue<IByteBuffer>();
        //�������
        if (buffer != null) this.queue.Enqueue(buffer);


        if ((this.channel != null && this.channel.Open && this.channel.IsWritable) && !this.IsRunQueue)
        {

            //����������״̬����TRUE
            this.IsRunQueue = true;
            IByteBuffer send = null;


            //�������е�����ȡ�����з���
            try
            {
                while ((send = this.queue.Dequeue()) != null)
                {
                    Debug.Log("���������������:" + send.Array.Length);
                    this.channel.WriteAndFlushAsync(new DatagramPacket(send, new IPEndPoint(IPAddress.Parse(this.IP), this.Port)));
                }
            }
            catch (Exception) { }


            //�����򽫶�������״̬����FLASE
            this.IsRunQueue = false;
        }

    }

}
