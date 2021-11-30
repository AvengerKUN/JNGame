package cn.jisol.ngame.room.defalut;

import cn.jisol.ngame.client.nclient.SocketNClient;
import cn.jisol.ngame.room.tool.ReadWriteNRoom;

public class DefaultNRoom extends ReadWriteNRoom<SocketNClient> {

    public DefaultNRoom(String uuid) {
        super(uuid);
    }

    public void addClient(SocketNClient client){
        super.clients.add(client);
    }

}
