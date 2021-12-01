package cn.jisol.ngame.game.action.nudp.service;

import cn.jisol.ngame.rpc.NGameRPCClass;
import cn.jisol.ngame.rpc.mode.uid.NUIDMode;

@NGameRPCClass
public class SNGameUDPAction {

    @NUIDMode("nudp-1")
    public void nUID(){
        System.out.println("SNGameUDPAction - nUID");
    }

}
