package cn.jisol.ngame.client;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.rpc.CNGameCActionValue;
import cn.jisol.ngame.rpc.action.CNGameCActionInstance;
import lombok.Getter;
import lombok.Setter;

import javax.websocket.Session;
import java.lang.reflect.Field;
import java.util.Objects;

@Getter
@Setter
public abstract class NClient<M,S> {

    private String uuid;
    private Session session;

    public NClient(Session session){
        this.uuid = session.getId();
        this.session = session;

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

    public void onSend(S o){
        if(session.isOpen())
            session.getAsyncRemote().sendObject(o);
    };
}
