package cn.jisol.ngame.game.action.service;

import cn.hutool.core.lang.Filter;
import cn.hutool.core.util.ArrayUtil;
import cn.jisol.ngame.client.nclient.SocketNClient;
import cn.jisol.ngame.dto.DSyncMessage;
import cn.jisol.ngame.entity.GOwner;
import cn.jisol.ngame.entity.action.GAction;
import cn.jisol.ngame.ncall.NCall;
import cn.jisol.ngame.ncall.NCallServiceImpl;
import cn.jisol.ngame.proto.snake.GSnakeMessage;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.NRPCParam;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import cn.jisol.ngame.network.websocket.game.GameWebSocket;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import cn.jisol.ngame.sync.fps.NSyncFPSMethod;
import cn.jisol.ngame.sync.fps.NSyncFPSMode;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@NGameRPCClass
public class SNGameAction extends NCallServiceImpl {

    //同步nSyncModes
    private Map<String, NSyncFPSMode<DSyncMessage>> nSyncModes = new HashMap<>();

    @Override
    public List<NCall> register() {
        return new ArrayList<NCall>(){{}};
    }


    /**
     * RPC 传输测试 ProtoBuf对象传输nGameProtoBuf
     * 推荐: 底层传输格式 ProtoBuf
     */
    @NGameRPCMethod
    public void nGameProtoBuf(SocketNClient client, GSnakeMessage.GSnakeHelloMessage message){
        try {

            System.out.println(String.format("SNGameAction - nGameHello : %s", message.getValue()));

            //ProtoBuf传输测试
            client.getCNGameAction().nGameProtoBuf(message);

            //参数 参数测试
            client.getCNGameAction().nGameParams("Jisol Kyu",20, new HashMap<Object, Object>(){
                {
                    put("user","Jisol Kyu");
                    put("userId",20);
                }
            });

            //无参数 传递
            client.getCNGameAction().nGameHello();

            //UID
            client.getCNGameAction().nGameUUIDMode();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * RPC 传输测试 参数传输
     * 不推荐 : 底层实现数据格式是 JSON
     */
    @NGameRPCMethod
    public void nGameParams(@NRPCParam("name") String name,@NRPCParam("userId") Integer userId,@NRPCParam("user") HashMap user){
        System.out.println(String.format("SNGameAction - nGameParams : %s - %s - %s",name,userId,user));
    }

    /**
     * RPC 传输测试 无参传输
     */
    @NGameRPCMethod
    public void nGameHello(){
        System.out.println("SNGameAction - nGameHello");
    }

    /**
     * RPC 传输测试 UID
     */
    @NUIDMode("123456")
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nGameUUIDMode(){System.out.println("SNGameAction - nGameUUIDMode");}

    /**
     * 开始帧同步模式
     */
    @NGameRPCMethod
    public void nGameSyncStart(SocketNClient client){

        NSyncFPSMode<DSyncMessage> nSyncMode = null;
        if(Objects.isNull(nSyncMode = this.nSyncModes.get(client.getRoom().getUuid()))){
            nSyncMode = new NSyncFPSMode<>();
            nSyncMode.setIntervalTime(1000/15); //设置延迟时间
            nSyncMode.setUuid(client.getRoom().getUuid());
            this.nSyncModes.put(client.getRoom().getUuid(),nSyncMode);
            addRegister(nSyncMode);
        }

        nSyncMode.start();

        System.out.println("SNGameAction - nGameSyncStart : 开始同步模式");
    }

    /**
     * 结束帧同步模式
     */
    @NGameRPCMethod
    public void nGameSyncEnd(SocketNClient client){
        NSyncFPSMode<DSyncMessage> nSyncMode = null;
        if(Objects.nonNull(nSyncMode = this.nSyncModes.get(client.getRoom().getUuid())))
            nSyncMode.end();

        System.out.println("SNGameAction - nGameSyncEnd : 结束同步模式");
    }

    /**
     * 向帧同步模式存储 权限
     */
    @NGameRPCMethod
    public void nGameSyncAuth(SocketNClient client, @NRPCParam("action") GOwner owner){

        NSyncFPSMode<DSyncMessage> nSyncMode = null;

        owner.setUserId(client.getUuid());

        if(Objects.nonNull(nSyncMode = this.nSyncModes.get(client.getRoom().getUuid())))
            nSyncMode.addFPSInfo(String.format("%s",owner.getUid()),new DSyncMessage(DSyncMessage.D_SYNC_OWNER,owner));
    }

    /**
     * 向帧同步模式存储
     */
    @NGameRPCMethod
    public void nGameSyncSave(SocketNClient client, @NRPCParam("action") GAction action){

        NSyncFPSMode<DSyncMessage> nSyncMode = null;

        action.setUserId(client.getUuid());

        if(Objects.nonNull(nSyncMode = this.nSyncModes.get(client.getRoom().getUuid())))
            nSyncMode.addFPSInfo(String.format("%s-%s",client.getUuid(),action.getUid()),new DSyncMessage(DSyncMessage.D_SYNC_ACTION,action));
//            nSyncMode.addFPSInfo(String.format("%s",action.getUid()),action);

    }

    /**
     * 同步模式回调
     */
    @NSyncFPSMethod
    public void nGameSyncCallBack(String uuid,NFPSInfo<DSyncMessage> nFPSInfo){


        GameWebSocket.ROOMS.get(uuid).getClients().forEach(
                (SocketNClient client) -> {

                    NFPSInfo<DSyncMessage> info = new NFPSInfo<>();

                    info.setDs(new ArrayList<>(Arrays.asList(
                            ArrayUtil.filter(nFPSInfo.getDs().toArray(new DSyncMessage[0]), (Filter<DSyncMessage>) v -> {

                                //数据筛选
                                if (v.getType().equals(DSyncMessage.D_SYNC_ACTION))
                                    return !client.getUuid().equals(((GAction)v.getMessage()).getUserId());

                                if (v.getType().equals(DSyncMessage.D_SYNC_OWNER)){
                                    GOwner owner =  ((GOwner)v.getMessage());
                                    owner.setIm(client.getUuid().equals(owner.getUserId()));

                                    return true;
                                }

                                return true;

                            })
                    )));

                    info.setI(nFPSInfo.getI());

                    client.getCNGameAction().nGameSyncCallBack(info);

                }
        );

//        System.out.println(String.format("SNGameAction - nGameSyncCallBack : 房间[%s]-同步模式回调[%s]",uuid,nFPSInfo.getI()));

    }

}
