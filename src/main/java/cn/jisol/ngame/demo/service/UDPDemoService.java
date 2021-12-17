package cn.jisol.ngame.demo.service;

import cn.jisol.ngame.demo.client.UnityNClient;
import cn.jisol.ngame.demo.entity.udp.SActorOwner;
import cn.jisol.ngame.demo.game.action.unity.service.SNGameUDPAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Map;

@Service
public class UDPDemoService {

    @Autowired
    SNGameUDPAction sNGameUDPAction;

    //删除某个用户的所有Actor权重
    public void delClientToActorOwner(UnityNClient client){

        Map<String, SActorOwner> dActorOwners = sNGameUDPAction.getDActorOwners();
        Iterator<SActorOwner> values = dActorOwners.values().iterator();

        SActorOwner sActorOwner;

        while (values.hasNext()) {
            sActorOwner = values.next();

            //找到属于client的权重进行删除
            if(sActorOwner.getClient().getUuid().equals(client.getUuid())){
                dActorOwners.remove(String.valueOf(sActorOwner.getOwner().getUuid()));
            }

        }

    }

}
