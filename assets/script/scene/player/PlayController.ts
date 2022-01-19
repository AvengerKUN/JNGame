
import { _decorator, Component, Node, SystemEventType, EventTouch, Vec3, CCInteger, misc, RigidBody2D, Vec2, CameraComponent, Camera, Prefab, instantiate, v2, v3 } from 'cc';
const { ccclass, property } = _decorator;


import { instance, SpeedType } from "./JoyStick";
import type { JoystickDataType } from "./JoyStick";

/**
 * Predefined variables
 * Name = NewComponent
 * DateTime = Tue Jan 18 2022 10:04:33 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = NewComponent.ts
 * FileBasenameNoExtension = NewComponent
 * URL = db://assets/script/scene/player/NewComponent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('PlayController')
export class PlayController extends Component {

    @property({
        type: Prefab,
        tooltip: "子弹",
    })
    bullet:Prefab = null;
    @property({
        type: Node,
        tooltip: "子弹地图",
    })
    bulletMap:Node = null;

    @property({
        tooltip: "速度级别",
    })
    speedType: SpeedType = SpeedType.STOP;
    
    @property({
        type: CCInteger,
        tooltip: "移动速度",
    })
    moveSpeed = 0;

    @property({
      displayName: "Move Dir",
      tooltip: "移动方向",
    })
    moveDir = new Vec3(0, 1, 0);

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

    body: RigidBody2D | null = null;

    start () {

        this.body = this.node.getComponent(RigidBody2D);

        instance.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        instance.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy(){
        console.log('onDestroy');
        instance.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
        instance.off(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.off(SystemEventType.TOUCH_END, this.onTouchEnd, this);
    }
    
    onTouchStart() {}

    onTouchMove(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;
        this.moveDir = data.moveVec;
        this.onSetMoveSpeed(this.speedType);
    }

    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this.speedType = data.speedType;
        this.onSetMoveSpeed(this.speedType);
    }

    onSetMoveSpeed(speedType: any) {
        switch (speedType) {
          case SpeedType.STOP:
            this.moveSpeed = this.stopSpeed;
            break;
          case SpeedType.NORMAL:
            this.moveSpeed = this.normalSpeed;
            break;
          case SpeedType.FAST:
            this.moveSpeed = this.fastSpeed;
            break;
          default:
            break;
        }
    }

    /**
     * 移动
     */
    move() {

        this.node.angle = misc.radiansToDegrees(Math.atan2(this.moveDir.y, this.moveDir.x)) - 90;

        if (this.body) {
            const moveVec = this.moveDir.clone().multiplyScalar(this.moveSpeed / 20);
            const force = new Vec2(moveVec.x, moveVec.y);
            this.body.applyForceToCenter(force, true);
        }
    }

    
    update(deltaTime: number) {
        if (this.speedType !== SpeedType.STOP) {
            this.move();
        }
    }

    /**
     * 射击
     */
    cPlayerShoot(){
        //子弹初始化
        let bullet = instantiate(this.bullet);

        bullet.angle = this.node.angle;
        let ration = (this.node.angle*Math.PI/180) + (Math.PI/2);
        console.log(ration);
        let direction = v2(Math.cos(ration),Math.sin(ration));

        bullet.setPosition(this.node.position.x + 40 * direction.x,this.node.position.y + 40 * direction.y);
        this.bulletMap.addChild(bullet);
        
        //射击
        let body = bullet.getComponent(RigidBody2D);

        if (body) {
            body.linearVelocity = direction.normalize().multiply(v2(10,10));
            // body.applyForceToCenter(  , true);
        }
        

    }

}
