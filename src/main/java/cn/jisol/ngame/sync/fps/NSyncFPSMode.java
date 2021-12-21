package cn.jisol.ngame.sync.fps;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.ncall.NCallService;
import cn.jisol.ngame.sync.NSyncMode;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Method;
import java.util.*;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 同步帧 - 一般用于同步操作
 */
@Getter
@Setter
public class NSyncFPSMode<D> implements NSyncMode {

    private NCallService nCallService;
    private ArrayList<Method> methods = new ArrayList<>();
    private Thread thread;
    private String uuid;

    //间隔时间
    private Integer intervalTime = 1000/15;
    //是否执行
    private Boolean isExecute = false;
    //数据列表
    private CopyOnWriteArrayList<NFPSInfo<D>> dataList = null;
    //当前帧
    private Integer index = null;
    //当前临时帧数据
    private Map<String,D> nFPSInfoMap = null;
    private NFPSInfo<D> nFPSInfos = null;

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
        dataList = new CopyOnWriteArrayList<>();
        index = 0;

        thread = new Thread(() -> {

            //临时帧
            nFPSInfos = new NFPSInfo<D>();
            //临时Map帧
            nFPSInfoMap = new ConcurrentHashMap<>();

            while (isExecute){
                nFPSInfos.setI(index++);

                try {
                    Thread.sleep(intervalTime);
                }catch (Exception e){}

                //添加Map中的帧
                if(Objects.nonNull(nFPSInfos)){
                    nFPSInfos.addInfos(nFPSInfoMap.values());
                }
                //重新赋值
                nFPSInfos = new NFPSInfo<D>();
                nFPSInfoMap = new ConcurrentHashMap<>();

                dataList.add(nFPSInfos);

                //调用方法
                methods.forEach(method -> {
                    try {
                        method.invoke(this.nCallService,this.uuid,nFPSInfos);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });

            }

        });

        thread.start();

    }

    @Override
    public void end() {

        this.isExecute = false;

    }

    //获取指定开始到结束的帧
    public List<NFPSInfo<D>> vGetFrame(Integer start, Integer end){

        //默认值
        if(Objects.isNull(start)) start = 0;
        if(Objects.isNull(end)) end = this.dataList.size() - 1;

        return new CopyOnWriteArrayList<>(this.dataList.subList(start, end));

    }

    //将数据插入到最新帧
    public boolean addFPSInfo(D info){
        if(!this.isExecute || Objects.isNull(this.nFPSInfos)) return false;
        nFPSInfos.addInfo(info);
        return true;

    }

    //将数据插入到最新帧
    public boolean addFPSInfos(List<D> info){
        if(!this.isExecute || Objects.isNull(this.nFPSInfos)) return false;
        nFPSInfos.addInfos(info);
        return true;
    }
    //将数据插入到最新帧 唯一存储 用于限制 客户端重复提交
    public boolean addFPSInfo(String key,D info){
        if(!this.isExecute || Objects.isNull(this.nFPSInfoMap)) return false;
        this.nFPSInfoMap.put(key,info);
        return true;
    }
}
