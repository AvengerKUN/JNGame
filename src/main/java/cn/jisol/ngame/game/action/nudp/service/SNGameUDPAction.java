package cn.jisol.ngame.game.action.nudp.service;

import cn.jisol.ngame.client.nclient.SocketNClient;
import cn.jisol.ngame.client.nclient.UDPClient;
import cn.jisol.ngame.dto.DSyncMessage;
import cn.jisol.ngame.ncall.NCallServiceImpl;
import cn.jisol.ngame.proto.mvector.MVector3OuterClass.*;
import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.NRPCParam;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import cn.jisol.ngame.sync.fps.NSyncFPSMode;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Component
@NGameRPCClass
public class SNGameUDPAction extends NCallServiceImpl {

    //同步nSyncModes
    private Map<String, NSyncFPSMode<MVector3>> nSyncModes = new HashMap<>();

    @NUIDMode(1)
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nUID(MVector3 vector3){
        System.out.println(String.format("SNGameUDPAction - nUID : X:%s Y:%s Z:%s",vector3.getX(),vector3.getY(),vector3.getZ()));
    }

    @NGameRPCMethod
    public void nMethod(MVector3 vector3){
        System.out.println(String.format("SNGameAction - nMethod : X:%s Y:%s Z:%s",vector3.getX(),vector3.getY(),vector3.getZ()));
    }

    /**
     * 开始帧同步模式
     */
    @NGameRPCMethod
    public void nGameSyncStart(UDPClient client){

        String uuid = client.getSession().getSId();

        NSyncFPSMode<MVector3> nSyncMode = null;
        if(Objects.isNull(nSyncMode = this.nSyncModes.get(uuid))){
            nSyncMode = new NSyncFPSMode<>();
            nSyncMode.setIntervalTime(1000/1); //设置延迟时间
            nSyncMode.setUuid(uuid);
            this.nSyncModes.put(uuid,nSyncMode);
            //添加同步功能
            addRegister(nSyncMode);
        }

        //开启同步
        nSyncMode.start();
        System.out.println("SNGameAction - nGameSyncStart : 开始同步模式");
    }

}
