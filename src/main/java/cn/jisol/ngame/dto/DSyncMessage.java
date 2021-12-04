package cn.jisol.ngame.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DSyncMessage {

    public static final Integer D_SYNC_ACTION = 0; //同步Action
    public static final Integer D_SYNC_OWNER = 1; //同步Owner 权限

    Integer type = null;
    Object message = null;

    public DSyncMessage(Integer type, Object message) {
        this.type = type;
        this.message = message;
    }
}
