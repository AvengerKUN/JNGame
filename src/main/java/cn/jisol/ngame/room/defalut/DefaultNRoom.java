package cn.jisol.ngame.room.defalut;

import cn.jisol.ngame.client.defalut.DefaultNClient;
import cn.jisol.ngame.room.tool.ReadWriteNRoom;

public class DefaultNRoom extends ReadWriteNRoom<DefaultNClient> {

    public DefaultNRoom(String uuid) {
        super(uuid);
    }

    public void addClient(DefaultNClient client){
        super.clients.add(client);
    }

}
