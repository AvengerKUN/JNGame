package cn.jisol.ngame.room.tool;

import cn.jisol.ngame.client.NClient;
import cn.jisol.ngame.room.NRoom;
import java.util.concurrent.CopyOnWriteArrayList;

public class ReadWriteNRoom<C extends NClient> extends NRoom<C> {

    public ReadWriteNRoom(String uuid) {
        super(uuid);
        clients = new CopyOnWriteArrayList<>();
    }

}
