package cn.jisol.ngame.ncall;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class NCallServiceImpl implements NCallService {

    private List<NCall> calls = null;

    public NCallServiceImpl(){
        this.calls = this.register();

        //开始初始化
        this.calls.forEach(nCall -> {
            nCall.init(this);
        });
    }

    public List<NCall> register(){
        return new ArrayList<>();
    }

    public void addRegister(NCall nCall){
        if(Objects.nonNull(calls)){
            calls.add(nCall);
            nCall.init(this);
        }
    }

}
