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
 
这是NGame的启动Class
 
 */
public class NGameApplication : MonoBehaviour
{

    public string IP = null;
    public int Port = 1000;
    public int aliveTime = 1000; //心跳时间

    private Queue<byte[]> queue; //消息发送队列
    private bool IsRunQueue = false;

    //包含 NGameRPCClass 的 Attribute 组
    public Dictionary<string, NGameRPCIntensifier> rClass = new Dictionary<string, NGameRPCIntensifier>();
    //包含所有方法
    public Dictionary<string, MethodInfo> rMethods = new Dictionary<string, MethodInfo>();
    //当前NGame管理的所有NGameAction网络类
    public List<NGameActor> nGameActors = new List<NGameActor>();
    //当前NGame管理的所有NGameSync同步类
    public List<NGameSync> nNGameSyncs = new List<NGameSync>();


    private IPEndPoint ipSend; //服务器IP
    private IPEndPoint ipReceive; //自己的IP
    private Socket socketReceive; //接收的数据类型
    private Thread connectThread; //接收数据的线程
    private Timer aliveTimer; //心跳请求线程


    // Start is called before the first frame update
    void Start()
    {
        this.InitNetwork();
        Type[] types = AttributeUtil.GetAllSystemAttributeClass(typeof(NGameRPCClass));

        Debug.Log(string.Format("找到 NGameRPCClass 类 : {0}", types.Length));

        //初始化 types 中的 类 为RPC类
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

    //通过类型返回rClass中的类
    public object GetRClass(Type t)
    {
        if (this.rClass.ContainsKey(t.Name))
        {
            return this.rClass[t.Name];
        }
        return null;
    }


    //初始化网络
    void InitNetwork()
    {


        //定义连接的服务器ip和端口，可以是本机ip，局域网，互联网
        ipSend = new IPEndPoint(IPAddress.Parse(this.IP), this.Port);

        //定义服务端 进行接收 数据
        //定义侦听端口,侦听任何IP
        ipReceive = new IPEndPoint(IPAddress.Any, 0);

        //定义套接字类型,在主线程中定义
        socketReceive = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        //服务端需要绑定ip
        socketReceive.Bind(ipReceive);

        //开启一个线程连接，必须的，否则主线程卡死
        connectThread = new Thread(new ThreadStart(SocketReceive));
        connectThread.Start();
        //心跳请求
        //aliveThread = new Thread(new ThreadStart(UDPAlive));
        //aliveThread.Start();
        aliveTimer = new Timer(new TimerCallback((o) => { this.UDPAlive(); }),this,0,this.aliveTime);

        Debug.Log("初始化 UDP Client 成功");

    }


    /// <summary>
    /// 向服务器发送心跳请求
    /// </summary>
    public void UDPAlive()
    {
        //向服务器发送空数据
        this.SendQueue((new NGameMessage()).ToByteArray());
    }

    /// <summary>
    /// 循环接收数据
    /// </summary>
    public void SocketReceive()
    {
        byte[] recvData;
        byte[] buffer;
        int recvLen;

        //进入接收循环
        while (true)
        {
            //对data清零
            recvData = new byte[1024];
            EndPoint endPoint = (ipReceive as EndPoint);
            //获取客户端，获取客户端数据，用引用给客户端赋值
            recvLen = socketReceive.ReceiveFrom(recvData, ref endPoint);

            Debug.Log("接收到消息: " + recvLen); //打印信息

            buffer = new byte[recvLen];
            Array.Copy(recvData, buffer, recvLen);

            this.onMessage(buffer);

        }
    }

    void SocketSend(byte[] sends)
    {
        //发送给所有服务端
        socketReceive.SendTo(sends, ipSend);
    }

    private NGameRPCIntensifier NewRPCClass(NGameRPCIntensifier type)
    {

        //通过RPC 增强器 初始化对象
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
                //判断是否包含 NUIDMode 注解
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
     * 队列发送消息 如果因为服务未启动 或者 不可写 则加入到队列中
     */

    public void SendQueue(byte[] buffer)
    {
        if (this.queue == null) this.queue = new Queue<byte[]>();
        //加入队列
        if (buffer != null) this.queue.Enqueue(buffer);


        if (this.socketReceive != null && !this.IsRunQueue)
        {

            //将队列运行状态设置TRUE
            this.IsRunQueue = true;
            byte[] send = null;


            //将队列中的数据取出进行发送
            try
            {
                while ((send = this.queue.Dequeue()) != null)
                {
                    Debug.Log("向服务器发送数据:" + buffer.Length);
                    this.SocketSend(send);
                }
            }
            catch (Exception) { }


            //结束则将队列运行状态设置FLASE
            this.IsRunQueue = false;
        }

    }

    //统一接收消息
    public void onMessage(byte[] buffer)
    {

        //将byte 转 NGameMessage 对象
        NGameMessage nGameMessage = NGameMessage.Parser.ParseFrom(buffer);

        //RPC 调用器
        MethodInfo method = null;

        //找到调用的方法
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

        //判断是否找到方法如果没有则返回
        if (method == null) return;

        //处理参数传入
        ParameterInfo[] argsType = method.GetParameters();
        object[] args = new object[argsType.Length];

        //找到参数传入args
        for (int i = 0; i < argsType.Length; i++)
        {
            //默认值为空
            args[i] = null;

            //判断参数是否属于Protobuf 的 IMessage
            if (typeof(IMessage).IsAssignableFrom(argsType[i].ParameterType))
            {

                MethodInfo methodInfo = nGameMessage.Message.GetType().GetMethod("Unpack");
                methodInfo = methodInfo.MakeGenericMethod(argsType[i].ParameterType);

                args[i] = methodInfo.Invoke(nGameMessage.Message,new object[] { });

            }

            //判断参数是否需要NGameApplication 
            if (typeof(NGameApplication).IsAssignableFrom(argsType[i].ParameterType))
            {
                args[i] = this;
            }


        }


        //找到这个方法的Object
        method.Invoke(this.GetRClass(method.ReflectedType),args);
        
    }


    //连接关闭
    void OnApplicationQuit()
    {
        //关闭线程
        if (connectThread != null)
        {
            connectThread.Interrupt();
            connectThread.Abort();
            aliveTimer.Dispose();
        }
        //最后关闭socket
        if (socketReceive != null)
            socketReceive.Close();
    }

}
