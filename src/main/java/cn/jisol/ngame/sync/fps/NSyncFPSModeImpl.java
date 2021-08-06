package cn.jisol.ngame.sync.fps;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.ncall.NCallService;
import cn.jisol.ngame.sync.NSyncMode;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

/**
 * 同步帧 - 一般用于同步操作
 */
@Getter
@Setter
public class NSyncFPSModeImpl<D> implements NSyncMode {

    private NCallService nCallService;
    private ArrayList<Method> methods = new ArrayList<>();
    private Thread thread;

    //间隔时间
    private Integer intervalTime = 1000/15;
    //是否执行
    private Boolean isExecute = false;
    //数据列表
    private LinkedList<NFPSInfo<D>> dataList = null;
    //当前帧
    private Integer index = null;

    @Override
    public void init(NCallService nCallService) {

        this.nCallService = nCallService;

        Method[] methods = nCallService.getClass().getMethods();

        for (int i = 0; i < methods.length; i++) {
            if(Objects.nonNull(AnnotationUtil.getAnnotation(methods[i],NSyncFPSMethod.class))){
                this.methods.add(methods[i]);
            }
        }

        System.out.println(String.format("%s 创建帧同步事件(%s) 等待激活.",nCallService.getClass().getSimpleName(),this.methods.size()));

    }

    @Override
    public void start() {

        if (Objects.nonNull(thread) && thread.isAlive()) return;

        isExecute = true;
        dataList = new LinkedList<>();
        index = 0;

        thread = new Thread(() -> {
            NFPSInfo<D> nFPSInfo;

            while (isExecute){
                nFPSInfo = new NFPSInfo<D>();
                nFPSInfo.setIndex(index);
                dataList.add(nFPSInfo);

                try {
                    Thread.sleep(intervalTime);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                //调用方法
                methods.forEach(method -> {
                    try {
                        method.invoke(this.nCallService,dataList.get(dataList.size() - 1));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });

                index++;
            }

        });

        thread.start();

    }

    @Override
    public void end() {

        this.isExecute = false;

    }

    //将数据插入到最新帧
    public boolean addFPSInfo(D info){

        if(!this.isExecute || Objects.isNull(dataList) || dataList.size() < 1) return false;
        dataList.get(dataList.size() - 1).addInfo(info);
        return true;

    }
}
