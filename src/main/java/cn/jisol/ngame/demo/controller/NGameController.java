package cn.jisol.ngame.demo.controller;


import cn.jisol.ngame.demo.game.action.cocos.frame.service.SNCocosFrameAction;
import cn.jisol.ngame.demo.util.NServerUtil;
import cn.jisol.ngame.demo.util.NewsContext;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Objects;

@Api(value = "DEMO - API 测试", tags = {"DEMO - API 测试"})
@RestController
@RequestMapping("/open")
@ResponseBody
public class NGameController {

    public NServerUtil nServerUtil = new NServerUtil((byte) 101);

    @Autowired
    SNCocosFrameAction snCocosFrameAction;

    @ApiImplicitParams({
    })
    @ApiOperation(value = "获取服务器 Action 唯一 Id")
    @GetMapping("/udp/next")
    public NewsContext<Integer> next(){
        return NewsContext.onSuccess("获取成功",nServerUtil.nextId());
    }

    @ApiImplicitParams({
        @ApiImplicitParam(name="start",value="帧开始"),
        @ApiImplicitParam(name="end",value="帧结束")
    })
    @ApiOperation(value = "获取DEMO CocosFrame 帧数据")
    @GetMapping("/cocos-frame")
    public synchronized NewsContext<List<NFPSInfo<Object>>> vCocosFrame(Integer start, Integer end){

        //获取帧信息
        List<NFPSInfo<Object>> frames = null;
        if(Objects.nonNull(snCocosFrameAction.nSyncFPSMode)){
            frames = snCocosFrameAction.nSyncFPSMode.vGetFrame(start, end);
        }

        if(Objects.isNull(frames)){
            return NewsContext.onFail("获取失败", null);
        }
        return NewsContext.onSuccess("获取成功",frames);
    }
}
