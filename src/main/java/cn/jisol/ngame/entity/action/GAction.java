package cn.jisol.ngame.entity.action;

import cn.jisol.ngame.client.NClient;
import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonFilter;
import lombok.Getter;
import lombok.Setter;
import mikera.vectorz.Vector2;

/**
 * 游戏的基础实体
 */
@Getter
@Setter
public class GAction {

    //实体uid
    private String uid;

    //实体位置
    private Vector2 position;

    //实体角度
    private Double angle;

    //控制者用户Id
    @JSONField(serialize = false)
    private transient String userId;

}
