package cn.jisol.ngame.demo.entity.udp;

import cn.jisol.ngame.demo.client.UnityNClient;
import cn.jisol.ngame.demo.proto.sync.DActorOwnerOuterClass;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SActorOwner {

    private UnityNClient client; //控制者客户端
    private DActorOwnerOuterClass.DActorOwner owner; //权重

}
