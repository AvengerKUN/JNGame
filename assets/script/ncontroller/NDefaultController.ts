import { Vec3, _decorator } from "cc";
import FMonitorEulerAngles from "../../ngame/sync/moitor/FMonitorEulerAngles";
import FMonitorPosition from "../../ngame/sync/moitor/FMonitorPosition";
import NGameDemoFStateComponent from "../ngame/NGameDemoFStateComponent";


export class NDefaultController extends NGameDemoFStateComponent{

    get nPosition(){
        return this.monitors.get("position").message();
    }
    set nPosition(value){
        this.nset(() => {
            this.monitors.get("position").modify(value,this.isowner);
        })
    }

    get nEulerAngles(){
        return this.monitors.get("eulerAngles").message();
    }
    set nEulerAngles(value){
        this.nset(() => {
            this.monitors.get("eulerAngles").modify(value,this.isowner);
        })
    }

    onLoad(){

        super.onLoad();

        //添加同步监听
        this.addMonitor("position",new FMonitorPosition(this.node));
        this.addMonitor("eulerAngles",new FMonitorEulerAngles(this.node));
    }

}