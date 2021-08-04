package cn.jisol.ngame.room;

import cn.jisol.ngame.client.NClient;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class NRoom<C extends NClient> {

    private String uuid = null;
    protected List<C> clients = null;

    public NRoom(){
        uuid = UUID.randomUUID().toString();
    }

    public NRoom(String uuid) {
        this.uuid = uuid;
    }
}
