package cn.jisol.ngame.sync.state;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.ncall.NCallService;
import cn.jisol.ngame.sync.NSyncMode;
import cn.jisol.ngame.sync.fps.NSyncFPSMethod;
import lombok.Getter;
import lombok.Setter;
import org.dyn4j.dynamics.Body;
import org.dyn4j.world.World;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;
import java.util.Objects;

/**
 * 状态同步 - 服务器模拟世界
 */
@Getter
@Setter
public class NSyncStateMode implements NSyncMode {

    //世界
    World<Body> world;
    //场景中的物体
    List<Body> actors;

    private NCallService nCallService;
    private Method mWorldInit;
    private Method mWorldStep;

    //世界运行的异步
    private Thread thread;
    //是否执行世界异步
    private Boolean isExecute = false;
    //世界推进频率
    private Integer nWorldStepTime = 1000/15;

    @Override
    public void init(NCallService nCallService) {

        this.nCallService = nCallService;

        Method[] methods = nCallService.getClass().getMethods();

        for (int i = 0; i < methods.length; i++) {
            if(Objects.nonNull(AnnotationUtil.getAnnotation(methods[i], NStateWorldInit.class)))
                this.mWorldInit = methods[i];
            if(Objects.nonNull(AnnotationUtil.getAnnotation(methods[i], NStateWorldStep.class)))
                this.mWorldStep = methods[i];
        }

    }

    @Override
    public void start() {

        //创建世界
        world = new World<>();

        //调用世界初始化方法
        try {
            this.mWorldInit.invoke(this.nCallService,world);
        } catch (Exception e) {
            e.printStackTrace();
        }

        isExecute = true;

        this.thread = new Thread(() -> {

            while (isExecute){
                //推进世界
                this.step();
                try {
                    //通知推进回调
                    this.mWorldStep.invoke(this.nCallService);

                    //等待时间
                    Thread.sleep(nWorldStepTime);
                }catch (Exception ignored){}
            }

        });

    }

    public void step(){
        this.world.step(1);
    }

    @Override
    public void end() {

    }
}
