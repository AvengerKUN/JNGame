package cn.jisol.ngame.game.action.nudp.service;

import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.NGameRPCMethod;
import cn.jisol.ngame.rpc.mode.NRPCMode;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;
import org.springframework.stereotype.Component;

@Component
@NGameRPCClass
public class SNGameUDPAction {

    @NUIDMode("nudp-1")
    @NGameRPCMethod(mode = NRPCMode.UID)
    public void nUID(){
        System.out.println("SNGameUDPAction - nUID");
    }

}
