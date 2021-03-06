package cn.jisol.ngame.demo.controller;


import cn.jisol.ngame.demo.game.action.cocos.frame.service.SNCocosFrameAction;
import cn.jisol.ngame.demo.service.CocosStateService;
import cn.jisol.ngame.demo.util.NServerUtil;
import cn.jisol.ngame.demo.util.NewsContext;
import cn.jisol.ngame.sync.fps.NFPSInfo;
import com.sun.management.OperatingSystemMXBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.lang.management.ManagementFactory;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Api(value = "DEMO - API 测试", tags = {"DEMO - API 测试"})
@RestController
@RequestMapping("/open")
@ResponseBody
public class NGameController {

    public NServerUtil nServerUtil = new NServerUtil((byte) 101);

    private static final OperatingSystemMXBean osmxb = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();

    //Cocos State房间列表
    private final List<String> rCocosState = new ArrayList<>();

    @Autowired
    SNCocosFrameAction snCocosFrameAction;
    @Autowired
    CocosStateService cocosStateService;

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


    @ApiImplicitParams({})
    @ApiOperation(value = "获取DEMO CocosBridge 房间列表")
    @GetMapping("/cocos-bridge/rooms")
    public NewsContext<List<HashMap>> vCocosBridgeRooms(){
        return NewsContext.onSuccess("获取成功", cocosStateService.vGetCocosStateRooms());
    }


    @ApiImplicitParams({})
    @ApiOperation(value = "获取系统占用")
    @GetMapping("/server")
    public NewsContext<HashMap> vServer(){
        //获取CPU
        double cpuLoad = osmxb.getSystemCpuLoad();
        int percentCpuLoad = (int) (cpuLoad * 100);
        //获取内存
        double totalvirtualMemory = osmxb.getTotalPhysicalMemorySize();
        double freePhysicalMemorySize = osmxb.getFreePhysicalMemorySize();
        double value = freePhysicalMemorySize/totalvirtualMemory;
        int percentMemoryLoad = (int) ((1-value)*100);

        return NewsContext.onSuccess("获取成功", new HashMap() {
            {
                put("cpu", percentCpuLoad);
                put("ram", percentMemoryLoad);
            }
        });
    }

    @ApiImplicitParams({
        @ApiImplicitParam(name="roomId",value="房间ID")
    })
    @ApiOperation(value = "添加房间")
    @GetMapping("/add/cocos/state/room")
    public NewsContext<Object> addCocosStateRoom(String roomId){

        this.rCocosState.add(roomId);
        return NewsContext.onSuccess("添加房间成功");

    }

    @ApiImplicitParams({})
    @ApiOperation(value = "查看创建房间列表")
    @GetMapping("/cocos/state/room/list")
    public NewsContext<List<String>> vCocosStateRoomList(){

        return NewsContext.onSuccess("查询成功", this.rCocosState);

    }

}
