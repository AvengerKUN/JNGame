import { CCInteger, EventTouch, SystemEventType, Vec3, _decorator } from "cc";
import { NStateSync, NSyncInput } from "../../nenity/NFrameInfo";
import NGameSyncComponent from "../../nscript/NGameSyncComponent";
import { instance, JoystickDataType, SpeedType } from "./JoyStick";

const { ccclass, property } = _decorator;

//创建属于自己的控制类 和 同步类
//输入
class IPlayer extends NSyncInput{

    //移动方向
    dir:Vec3;
    //移动速度
    speed:number;

}
//状态
class SPlayer extends NStateSync{

}

@ccclass('NPlayerController')
export default class NPlayerController extends NGameSyncComponent<IPlayer,SPlayer> {

    @property({
        tooltip: "速度级别",
    })
    speedType: SpeedType = SpeedType.STOP;
    
    @property({
        type: CCInteger,
        tooltip: "停止时速度",
    })
    stopSpeed = 0;

    @property({
        type: CCInteger,
        tooltip: "正常速度",
    })
    normalSpeed = 100;

    @property({
        type: CCInteger,
        tooltip: "最快速度",
    })
    fastSpeed = 200;

    onLoad(){
        
        instance.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        instance.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
        
    }


    initInput(): IPlayer {
        return new IPlayer();
    }
    
    onTouchStart() {}

    onTouchMove(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;
        this.getInput().dir = data.moveVec;
        this.onSetMoveSpeed(this.speedType);
    }

    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;
        this.onSetMoveSpeed(this.speedType);
    }

    onSetMoveSpeed(speedType: any) {
        switch (speedType) {
          case SpeedType.STOP:
            this.getInput().speed = this.stopSpeed;
            break;
          case SpeedType.NORMAL:
            this.getInput().speed = this.normalSpeed;
            break;
          case SpeedType.FAST:
            this.getInput().speed = this.fastSpeed;
            break;
          default:
            break;
        }
    }

    vGetStateSync(): SPlayer {
        
        let player = new SPlayer();
        player.position = this.node.position;
        player.angle = this.node.angle;

        return player;

    }

    nSyncState(state: SPlayer) {

        state.position && (this.node.position = state.position);
        state.angle && (this.node.angle = state.angle);

    }

}
