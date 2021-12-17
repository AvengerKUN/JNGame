package cn.jisol.ngame.room.defalut;

import cn.jisol.ngame.demo.client.CocosNClient;
import cn.jisol.ngame.room.tool.ReadWriteNRoom;

public class DefaultNRoom extends ReadWriteNRoom<CocosNClient> {

    public DefaultNRoom(String uuid) {
        super(uuid);
    }

    public void addClient(CocosNClient client){
        super.clients.add(client);
    }

}
