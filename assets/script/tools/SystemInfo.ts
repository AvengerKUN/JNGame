import { _decorator, Component, Node, v3, Label } from 'cc';
import { JGet } from '../../axios';
const { ccclass, property } = _decorator;

@ccclass('SystemInfo')
export class SystemInfo extends Component {

    @property({displayName:'服务器 Info Item',type:Label})
    nServerInfo:Label = null;

    //定时器
    timer:number = null;

    start(){

        //定时执行
        this.timer = setInterval(this.nServerUpdate.bind(this),1000);

    }

    async nServerUpdate(){

        //获取系统信息
        let info = (await JGet("/open/server")).data;

        this.nServerInfo.string = `当前服务器 CPU : ${info.cpu}% 内存 : ${info.memory}%`

    }

    onDisable(){
        clearInterval(this.timer);
    }

}