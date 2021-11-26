package cn.jisol.ngame.netty;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.hutool.core.lang.Editor;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.ClassUtil;
import cn.jisol.ngame.netty.network.JNettyNetwork;
import cn.jisol.ngame.netty.network.UDPJNettyNetwork;
import io.netty.handler.codec.MessageToMessageDecoder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.availability.AvailabilityChangeEvent;
import org.springframework.boot.availability.ReadinessState;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Repository;

import java.util.*;


/**
 * JNetty 主启动
 */
@Getter
@Setter
@Repository
public class InitJNettyStartListener implements ApplicationListener<AvailabilityChangeEvent> {

    //记录NGame JNetty的对象组
    private List<JNettyApplication> nettys = new ArrayList<>();

    /**
     * 启动方法
     */
    @Override
    public void onApplicationEvent(AvailabilityChangeEvent event) {

        if (ReadinessState.ACCEPTING_TRAFFIC != event.getState()) return;

        Set<Class<?>> classes = ClassUtil.scanPackage("cn.jisol.ngame");

        for (Class<?> value : classes) {

            AJNetty ajNetty = null;

            if(Objects.nonNull(ajNetty = AnnotationUtil.getAnnotation(value, AJNetty.class))){
                try {
                    if(JNettyNetwork.class.isAssignableFrom(ajNetty.network())){

                        JNettyApplication application = JNettyApplication.class.newInstance();

                        //添加协议类 和 控制器
                        application.setPort(ajNetty.port());
                        application.setController(value.newInstance());
                        application.setNetwork(ajNetty.network().newInstance());

                        for (Class<? extends MessageToMessageDecoder> decoder : ajNetty.decoders()) {
                            application.addDecoder(decoder.newInstance());
                        }

                        //获取全局 JNetty 进行 执行 start方法
                        if(application.start()) nettys.add(application);

                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        }

//        setNettys(Arrays.asList(ArrayUtil.filter(nettys.toArray(new JNetty[0]), (Editor<JNetty>) netty -> netty.start() ? netty : null)));
        System.out.println(String.format("JNetty启动成功 有效服务器数量: %s",nettys.size()));

    }


}
