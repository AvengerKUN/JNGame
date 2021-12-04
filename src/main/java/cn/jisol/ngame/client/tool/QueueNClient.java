package cn.jisol.ngame.client.tool;

import cn.jisol.ngame.client.NClient;

import javax.websocket.Session;
import java.util.Objects;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * 队列发送消息的客户端
 * @param <M>
 * @param <S>
 * @param <C>
 */

public abstract class QueueNClient<M , S, C> extends NClient<M,S,C> {

    private Queue<S> sQueue;
    private Thread qThread;

    public QueueNClient(String uuid,C session) {
        super(uuid,session);
        this.sQueue = new LinkedBlockingQueue<>();
    }

    public void onSendQueue(S o) {
        this.sQueue.add(o);
        //激活队列发送
        this.runQueueSends();
    }

    private void runQueueSends(){
        if(Objects.nonNull(qThread) && qThread.isAlive()) return;

        qThread = new Thread(() -> {
            S sMessage = null;
            while (Objects.nonNull((sMessage = sQueue.poll()))){
                this.onSend(sMessage);
            }
        });
        qThread.start();
    }
}
