package cn.jisol.ngame.demo.entity;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GOwner {

    //授权的物体ID
    String uid = null;

    //是否是自己的权限
    Boolean im = null;

    //权限大小(默认使用帧表示权限大小 如果这个有值则使用这个)
    Integer v = null;

    //控制者用户Id
    @JSONField(serialize = false)
    private transient String userId;

    public GOwner(String uid, String userId) {
        this.uid = uid;
        this.userId = userId;
    }
}
