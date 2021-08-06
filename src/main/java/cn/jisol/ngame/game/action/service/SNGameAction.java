package cn.jisol.ngame.game.action.service;

import cn.jisol.ngame.client.defalut.DefaultNClient;
import cn.jisol.ngame.ncall.NCall;
import cn.jisol.ngame.ncall.NCallServiceImpl;
import cn.jisol.ngame.proto.message.NGameMessageOuterClass.*;
import cn.jisol.ngame.proto.snake.GSnakeMessage;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.NRPCParam;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import cn.jisol.ngame.sync.fps.NSyncFPSMethod;
import cn.jisol.ngame.sync.fps.NSyncFPSModeImpl;
import com.google.protobuf.Any;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Component
@NGameRPCClass
public class SNGameAction extends NCallServiceImpl {

    private NSyncFPSModeImpl<Number> nSyncMode;

    @Override
    public List<NCall> register() {
        this.nSyncMode = new NSyncFPSModeImpl<>();
        this.nSyncMode.setIntervalTime(1000/2); //设置延迟时间
        return new ArrayList<NCall>(){
            {
                add(nSyncMode);
            }
        };
    }


    /**
     * RPC 传输测试 ProtoBuf对象传输nGameProtoBuf
     * 推荐: 底层传输格式 ProtoBuf
     */
    @NGameRPCMethod
    public void nGameProtoBuf(DefaultNClient client, GSnakeMessage.GSnakeHelloMessage message){
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
    public void nGameSyncStart(){
        if(Objects.nonNull(nSyncMode))
            nSyncMode.start();

        System.out.println("SNGameAction - nGameSyncStart : 开始同步模式");
    }

    /**
     * 结束帧同步模式
     */
    @NGameRPCMethod
    public void nGameSyncEnd(){
        if(Objects.nonNull(nSyncMode))
            nSyncMode.end();

        System.out.println("SNGameAction - nGameSyncEnd : 结束同步模式");
    }

    /**
     * 向帧同步模式存储
     */
    @NGameRPCMethod
    public void nGameSyncSave(@NRPCParam("number") Integer number){

        nSyncMode.addFPSInfo(number);

    }

    /**
     * 同步模式回调
     */
    @NSyncFPSMethod
    public void nGameSyncCallBack(NFPSInfo<Number> nFPSInfo){

        System.out.println(String.format("SNGameAction - nGameSyncCallBack : 同步模式回调[%s]",nFPSInfo.getIndex()));

    }

}
