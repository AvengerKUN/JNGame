package cn.jisol.ngame.client.tool;

import cn.jisol.ngame.client.NClient;

import javax.websocket.Session;
import java.util.Objects;
import java.util.Queue;
import java.util.concurrent.LinkedBlockingQueue;

public abstract class QueueNClient<M ,S> extends NClient<M,S> {

    private Queue<S> sQueue;
    private Thread qThread;

    public QueueNClient(Session session) {
        super(session);
        this.sQueue = new LinkedBlockingQueue<>();
    }

    @Override
    public void onSend(S o) {
        this.sQueue.add(o);
        //激活队列发送
        this.runQueueSends();
    }

    private void runQueueSends(){
        if(Objects.nonNull(qThread) && qThread.isAlive()) return;

        qThread = new Thread(() -> {
            S sMessage = null;
            while (Objects.nonNull((sMessage = sQueue.poll()))){
                super.onSend(sMessage);
            }
        });
        qThread.start();
    }
}
