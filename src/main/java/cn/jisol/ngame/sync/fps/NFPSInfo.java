package cn.jisol.ngame.sync.fps;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;
import java.util.concurrent.CopyOnWriteArrayList;

@Getter
@Setter
public class NFPSInfo<D> implements Serializable {

    //帧索引
    private Number i = 0;

    //帧数据
    private ArrayList<D> ds = new ArrayList<D>();

    public boolean addInfo(D info){
        if(Objects.isNull(ds))
            ds = new ArrayList<>();

        return ds.add(info);
    }

    public boolean addInfos(Collection<D> info){
        if(Objects.isNull(ds))
            ds = new ArrayList<>();

        return ds.addAll(info);
    }

}
