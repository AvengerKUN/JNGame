package cn.jisol.ngame.demo.util;

/**
 * 服务器工具类
 */
public class NServerUtil {

    //服务器标识
    public String serverId = null;

    //当前index
    public int index = 1;


    public NServerUtil(byte serverId) {

        StringBuilder sId = new StringBuilder(String.valueOf(serverId));

        while (sId.length() < 3){
            sId.insert(0, "0");
        }

        this.serverId = sId.toString();
    }

    //获取下一个Id
    public synchronized Integer nextId(){

        return new Integer((index++) + serverId);

    }

}
