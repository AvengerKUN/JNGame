package cn.jisol.ngame.sync.fps;

import cn.hutool.core.annotation.AnnotationUtil;
import cn.jisol.ngame.ncall.NCallService;
import cn.jisol.ngame.sync.NSyncMode;
import lombok.Getter;
import lombok.Setter;

import java.lang.reflect.Method;
import java.util.*;

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
    private LinkedList<NFPSInfo<D>> dataList = null;
    //当前帧
    private Integer index = null;
    //当前临时帧数据
    private Map<String,D> fInfos = null;

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
                nFPSInfo.setI(index);
                dataList.add(nFPSInfo);

                try {
                    Thread.sleep(intervalTime);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                if(Objects.nonNull(this.fInfos)) dataList.get(dataList.size() - 1).addInfos(this.fInfos.values());
                this.fInfos = null;

                //调用方法
                methods.forEach(method -> {
                    try {
                        method.invoke(this.nCallService,this.uuid,dataList.get(dataList.size() - 1));
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
    //将数据插入到最新帧 唯一存储 用于限制 客户端重复提交
    public boolean addFPSInfo(String key,D info){

        if(!this.isExecute || Objects.isNull(dataList) || dataList.size() < 1) return false;
        if(Objects.isNull(this.fInfos)) this.fInfos = new HashMap<>();
        this.fInfos.put(key,info);
        return true;
    }
}
