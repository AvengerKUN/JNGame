package cn.jisol.ngame.demo.util;

import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.Builder;

@Builder
@ApiResponses({
    @ApiResponse(code = 200,message = "成功"),
    @ApiResponse(code = 500,message = "失败"),
})
public class NewsContext<T> {

    public static Integer NEWS_STATE_SUCCESS = 200;
    public static Integer NEWS_STATE_FAIL = 500;

    public Integer state = null;
    public String msg = null;
    public T data = null;

    public static <T> NewsContext<T> onSuccess(String msg){
        return onSuccess(msg,null);
    }
    public static <T> NewsContext<T> onSuccess(String msg, T data){
        return (NewsContext<T>) NewsContext.builder().state(NEWS_STATE_SUCCESS).msg(msg).data(data).build();
    }

    public static <T> NewsContext<T> onFail(String msg){
        return onFail(msg,null);
    }
    public static <T> NewsContext<T> onFail(String msg, T data){
        return (NewsContext<T>) NewsContext.builder().state(NEWS_STATE_FAIL).msg(msg).data(data).build();
    }

}
