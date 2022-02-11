package cn.jisol.ngame.demo.service;

import cn.hutool.core.util.ArrayUtil;
import cn.jisol.ngame.demo.client.cocos_bridge.CocosBridgeServer;
import cn.jisol.ngame.demo.network.websocket.game.CocosBridgeWebSocket;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class CocosStateService {


    public List<HashMap> vGetCocosStateRooms(){
        return ArrayUtil.map(CocosBridgeWebSocket.SERVERS.values().toArray(new CocosBridgeServer[0]), (v) -> {
            return new HashMap() {
                {
                    put("uuid", v.getUuid());
                    put("client", v.getClients().size());
                }
            };
        });
    }

}
