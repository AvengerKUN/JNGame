package cn.jisol.ngame.demo.entity.cocos.demo;

import cn.jisol.ngame.client.NClient;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class IDInfo {

    private Long nId;

    private IDEnum type;

    private NClient client;

    public enum IDEnum{

        Local,World

    }

}
