# JNGame

#### 介绍
NGame 是一个Java网络游戏服务器框架 基于 Spring Boot 编写 完美支持IOC AOP  
拥有RPC调用方式 使用 WebSocket UDP 成熟 注解API 立即启动各种服务器  

NGame还有 各种游戏引擎联机同步DEMO (cocos,unity)   
和 各种同步案例(帧同步,状态帧同步)  

持续更新中...  

遇到问题请联系QQ:2858626794  

#### 软件架构
master - JNGame 服务端代码 (包含NGame核心代码和各个Demo的服务端)

##### --- cocos ---
1.cocos - cocos 游戏引擎案例 - 状态帧同步 (物理权限交接) - [大致完成]  
2.cocos-frame - cocos 游戏引擎案例 - 帧同步 - [大致完成 ( 物理预测回滚-延期实现 ) ]  
2.cocos-state - cocos 游戏引擎案例 - 状态同步 - [计划编写]  

##### --- unity ---
1.unity - unity 游戏引擎案例 - 状态帧同步 (物理权限交接) - [完成 60%]  
2.unity-frame - unity 游戏引擎案例 - 帧同步 - [计划编写]

##### --- UE4 [暂时没有时间去实现] ---

#### 同步模式介绍
##### 状态帧同步 : 通过各个客户端发送的状态进行同步 实现物理权限交接(支持物理)
    优势:  
        1.适合长时间同步  
    劣势:  
        1.数据量较大  

##### 帧同步 : 通过各个客户端发送的操作进行同步 和 追帧同步
    优势:  
        1.数据量小  
    劣势:  
        1.不适合长时间同步  
        2.需要引擎支持物理确定性  
    
##### 状态同步 : 服务端模拟世界 发送 状态给客户端 (暂时没有想法去实现 )
    优势:      
        1.适合长时间同步  
        2.安全  
    劣势:
        1.数据量较大  
        2.开发效率低(麻烦)  

### NGame 文档
#### 运行NGame
    //将代码clone下来
    git clone https://gitee.com/jisol/ngame
    //通过IDEA 编辑器打开
    //运行
#### NGame 目录结构
    client - 客户端包
    demo - 案例DEMO
    listener - NGame 启动(无视)
    ncall - 扩展NGame功能(无视)
    netty - NGame Netty 协议包
    proto - 基础Protobuf
    room - 房间包
    rpc - RPC 实现
    sync - 同步包
    util - NGame工具包(无视)
#### RPC
##### @NGameRPCClass
- 声明这个类是RPC 类
##### @NGameRPCMethod(mode)
- 声明这个方法是RPC 方法
- mode - RPC调用模式 - NRPCMode (DEFAULT - 普通模式 | UID - ID模式)
- 声明的方法 可以 接收 NClient 参数 - 调用者
##### @NUIDMode
- 声明UID模式的ID值
##### @NRPCParam
- 指定的参数
##### NGameRPC.invoke - 调用RPC
- 将NGameMessage 数据解析进行RPC调用

#### RPC 使用案例
    @Component //注入到Spring 容器中
    @NGameRPCClass //声明这个类是RPC 类
    public class SNGameAction extends NCallServiceImpl {
    

        /**
         * RPC 传输测试 ProtoBuf GSnakeHelloMessage 对象传输
         * 推荐: 底层传输格式 ProtoBuf
         * client - 声明的方法 可以 接收 NClient 参数 - 调用者
         */
        @NGameRPCMethod //声明这个方法是RPC 方法
        public void nGameProtoBuf(CocosNClient client, GSnakeMessage.GSnakeHelloMessage message){
        }
        
        /**
         * RPC 传输测试 参数传输
         * 不推荐 : 底层实现数据格式是 JSON
         */
        @NGameRPCMethod
        public void nGameParams(@NRPCParam("name") String name,@NRPCParam("userId") Integer userId,@NRPCParam("user") HashMap user){
        }
        
        /**
         * RPC 传输测试 无参传输
         */
        @NGameRPCMethod
        public void nGameHello(){}
    
        /**
         * RPC 传输测试 UID
         */
        @NUIDMode(3)
        @NGameRPCMethod(mode = NRPCMode.UID)
        public void nGameUUIDMode(){}
        
    }

#### 服务器 启动
##### WebSocket 启动 - 使用 SpringBoot 自带
    @ServerEndpoint(
        value = "/game/{roomId}/{uuid}",
        encoders = {DefaultProtoBufEncoder.class}, //Protobuf 编码
        decoders = {DefaultProtoBufDecoder.class} //Protobuf 解码
    )
    @Controller
    public class GameWebSocket {
        @OnOpen
        public void onOpen(Session session){}
        @OnMessage
        public void onMessage(Session session,NGameMessage message){}
        @OnClose
        public void onClose(Session session){}
        @OnError
        public void onError(Session session, Throwable t){}
    }
    
##### UDP 服务器 - 使用 NGame + Netty
    
    @AJNetty( //NGame Netty 服务注解
        port = 1000, //端口
        network = UDPJNettyNetwork.class, //协议 这里是 UDP 服务 继承 JNettyNetwork 实现启动
        decoders = {
            DefaultProtoBufDecoder.class //Protobuf 编码 继承 JNByteToMessageDecoder NGame 编码器
        },
        encoders = {
            DefaultProtoBufEncoder.class //Protobuf 解码 继承 JNMessageToByteEncoder NGame 解码器
        }
    )
    @Component // 加入到Spring 容器 (支持注入)
    public class GameUDPServer {
        
        /**
         * 初始化开始 - 用于修改Network信息
         */
        @JNInit
        public void initNetwork(UDPJNettyNetwork network){}
        
        /**
         * 初始化成功
         */
        @JNInitSuccess
        public void initNetworkSuccess(UDPJNettyNetwork network){}
        
        /**
         * 打开用户连接
         */
        @JNOpen
        public void onOpen(UDPSession session,UDPSessionGroup clients){
        }
        
        /**
         * 接收用户消息
         */
        @JNMessage
        public void onMessage(UDPSession session,UDPSessionGroup clients, NGameMessage message,String text){}
    
        /**
         * 关闭用户链接
         */
        @JNClose
        public void onClose(UDPSession session,UDPSessionGroup clients){}
    }
    
#### NGame 同步模式
##### NSyncFPSMode 同步帧模式
- 定时收集数据 然后 发送

        @Component
        @NGameRPCClass
        public class SNCocosFrameAction extends NCallServiceImpl {
    
            //同步nSyncModes
            NSyncFPSMode<Object> nSyncFPSMode = null;
            //客户端列表
            public Map<String, CocosFrameNClient> clients = null;
            
            /**
             * 向帧同步添加输入
             * @param inputs 输入
             */
            @NGameRPCMethod
            public void nGameFrameInput(@NRPCParam("inputs") List<Object> inputs){
                if(Objects.isNull(nSyncFPSMode)) return;
                nSyncFPSMode.addFPSInfos(inputs); //向当前帧添加输入
            }
            
            /**
             * 启动帧同步
             */
            public void nGameSyncStart(){
        
                if(Objects.nonNull(nSyncFPSMode)) return;
        
                //创建帧同步对象
                nSyncFPSMode = new NSyncFPSMode<>();
                nSyncFPSMode.setIntervalTime(1000/15); //设置同步间隔
                
                /同步功能服务添加 - NCallServiceImpl
                addRegister(nSyncFPSMode);
        
                //开启同步
                nSyncFPSMode.start();
                
                System.out.println("SNCocosFrameAction - nGameSyncStart : 开始同步模式");
        
            }
            
            /**
             * 同步模式回调
             */
            @NSyncFPSMethod
            public void nGameSyncCallBack(String uuid, NFPSInfo<Object> nFPSInfo){
        
                if(Objects.isNull(clients)) return;
        
                //向所有客户端 发送帧数据
                clients.values().forEach(client -> {
                    client.getCnCocosFrameAction().nGameSyncInputCallBack(nFPSInfo);
                });
        
            }
        
        }
