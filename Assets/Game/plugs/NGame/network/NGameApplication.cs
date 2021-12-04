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
 
这是NGame的启动Class
 
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

    //包含 NGameRPCClass 的 Attribute 组
    public Dictionary<string, object> rClass = new Dictionary<string, object>();
    //包含所有方法
    public Dictionary<string, MethodInfo> rMethods = new Dictionary<string, MethodInfo>();


    // Start is called before the first frame update
    void Start()
    {

        this.InitNetwork();
        Type[] types = AttributeUtil.GetAllSystemAttributeClass(typeof(NGameRPCClass));

        //初始化 types 中的 类 为RPC类
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

    //通过类型返回rClass中的类
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

        //创建UDP 客户端
        this.group = new MultithreadEventLoopGroup();
        bootstrap = new Bootstrap();

        bootstrap
            .Group(group)
            .ChannelFactory(() => new SocketDatagramChannel(AddressFamily.InterNetwork))
            .Handler(new ActionChannelInitializer<IChannel>((channel) =>
            {
                Debug.Log("创建客户端成功");
                //初始化UDP NGame
                channel.Pipeline.AddLast(new InitNGameHandler());
            }));

        //开启UDP
        this.channel = await bootstrap.BindAsync(0);

        this.SendQueue(null);
    }

    private object NewRPCClass(Type type)
    {

        //通过RPC 增强器 初始化对象
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
     * 队列发送消息 如果因为服务未启动 或者 不可写 则加入到队列中
     */

    public void SendQueue(IByteBuffer buffer)
    {
        if (this.queue == null) this.queue = new Queue<IByteBuffer>();
        //加入队列
        if (buffer != null) this.queue.Enqueue(buffer);


        if ((this.channel != null && this.channel.Open && this.channel.IsWritable) && !this.IsRunQueue)
        {

            //将队列运行状态设置TRUE
            this.IsRunQueue = true;
            IByteBuffer send = null;


            //将队列中的数据取出进行发送
            try
            {
                while ((send = this.queue.Dequeue()) != null)
                {
                    Debug.Log("向服务器发送数据:" + send.Array.Length);
                    this.channel.WriteAndFlushAsync(new DatagramPacket(send, new IPEndPoint(IPAddress.Parse(this.IP), this.Port)));
                }
            }
            catch (Exception) { }


            //结束则将队列运行状态设置FLASE
            this.IsRunQueue = false;
        }

    }

}
