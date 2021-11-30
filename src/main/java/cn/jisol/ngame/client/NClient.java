package cn.jisol.ngame.client;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.action.CNGameCActionInstance;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;
import java.lang.reflect.Field;
import java.util.Objects;


/**
 * NGame主要客户端类
 * @param <M>
 * @param <S>
 */
@Getter
@Setter
public abstract class NClient<M,S,C> {

    private String uuid;
    private C session;

    public NClient(String uuid,C session){
        this.uuid = uuid;
        this.session = session;

        //将继承NClient中的Action注入
        for (Field field : this.getClass().getFields()){
            if((Objects.nonNull(AnnotationUtil.getAnnotation(field, CNGameCActionValue.class)))){
                try {
                    field.set(this, CNGameCActionInstance.newInstance(this,field.getType()));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public abstract void onMessage(M data);

    public abstract void onSend(S o);
}
