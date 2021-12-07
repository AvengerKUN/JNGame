package cn.jisol.ngame.demo.controller;


import cn.jisol.ngame.demo.util.NServerUtil;
import cn.jisol.ngame.demo.util.NewsContext;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.*;

@Api(value = "DEMO - UDP 测试", tags = {"DEMO - UDP 测试"})
@RestController
@RequestMapping("/open/udp")
@ResponseBody
public class NGameUDPController {

    public NServerUtil nServerUtil = new NServerUtil((byte) 101);

    @ApiImplicitParams({
    })
    @ApiOperation(value = "获取服务器 Action 唯一 Id")
    @GetMapping("/next")
    public NewsContext<Integer> next(){
        return NewsContext.onSuccess("获取成功",nServerUtil.nextId());
    }

}
