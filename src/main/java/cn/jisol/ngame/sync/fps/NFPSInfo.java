package cn.jisol.ngame.sync.fps;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Objects;

@Getter
@Setter
public class NFPSInfo<D> {

    //帧索引
    private Number index = null;

    //帧数据
    private ArrayList<D> data = null;

    public boolean addInfo(D info){
        if(Objects.isNull(data))
            data = new ArrayList<>();

        return data.add(info);
    }

}
