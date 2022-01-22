import { CCInteger , debug, EventTouch, misc,Node, Prefab, RigidBody2D, SystemEventType, instantiate,  Vec2, Vec3, _decorator, v2 } from "cc";
import { NAddActor, NStateSync, NSyncInput } from "../../nenity/NFrameInfo";
import NGameSyncComponent from "../../nscript/NGameSyncComponent";
import { instance, JoystickDataType, SpeedType } from "./JoyStick";
import { NBulletController } from "./NBulletController";

const { ccclass, property } = _decorator;

//创建属于自己的控制类 和 同步类

/**
 * 射击参数
 */
class ABullet extends NAddActor {
    nId:number;
    angle:number;
    position:Vec3;
}

//输入
class IPlayer extends NSyncInput{

    //移动方向
    dir:Vec3;
    //移动速度
    speed:number;
    //射击参数
    bullet:ABullet = null;
    // bullet:number;

}
//状态 (物理状态)
class SPlayer extends NStateSync{

    linearDamping:number;
    linearVelocity:Vec2;
    angularDamping:number;
    angularVelocity:number;

}

@ccclass('NPlayerController')
export default class NPlayerController extends NGameSyncComponent<IPlayer,SPlayer> {
    
    @property({
        type: CCInteger,
        tooltip: "停止时速度",
    })
    stopSpeed = 0;

    @property({
        type: Node,
        tooltip: "子弹地图",
    })
    bulletMap:Node = null;

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

    
    @property({
        displayName: "Move Dir",
        tooltip: "移动方向",
    })
    moveDir = new Vec3(0, 1, 0);

    @property({
        type: CCInteger,
        tooltip: "移动速度",
    })
    moveSpeed = 0;
    
    @property({
        type: Prefab,
        tooltip: "子弹",
    })
    bullet:Prefab = null;

    body: RigidBody2D | null = null;

    onLoad(){

        super.onLoad();

        this.body = this.node.getComponent(RigidBody2D);
        instance.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        instance.on(SystemEventType.TOUCH_MOVE, this.onTouchMove, this);
        instance.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
        
    }


    initInput(): IPlayer {
        return new IPlayer();
    }
    
    onTouchStart() {}

    onTouchMove(event: EventTouch, data: JoystickDataType) {
        this.getInput().dir = data.moveVec;
        this.onSetMoveSpeed(data.speedType);
    }

    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this.onSetMoveSpeed(data.speedType);
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

    /**
     * 获取同步类
     * @returns 返回同步类
     */
    vGetStateSync(): SPlayer {
        
        let player = new SPlayer();
        player.position = this.node.position;
        player.angle = this.node.angle;
        player.linearVelocity = this.body.linearVelocity;
        player.linearDamping = this.body.linearDamping;
        player.angularVelocity = this.body.angularVelocity;
        player.angularDamping = this.body.angularDamping;

        return player;

    }

    /**
     * 同步状态
     */
    nSyncState(state: SPlayer) {

        state.position && (this.node.position = state.position);
        state.angle && (this.node.angle = state.angle);

        //设置物理状态
        if(!this.body.linearVelocity.equals(state.linearVelocity))
            this.body.linearVelocity = state.linearVelocity
        if(this.body.linearDamping != state.linearDamping)
            this.body.linearDamping = state.linearDamping
        if(this.body.angularVelocity != state.angularVelocity)
            this.body.angularVelocity = state.angularVelocity
        if(this.body.angularDamping != state.angularDamping)
            this.body.angularDamping = state.angularDamping

    }

    //逻辑帧(核心 处理 输入)
    nUpdate(dt: number, input: IPlayer, nt: number) {

        // console.log("NPlayerController - nUpdate",dt,input,nt,this.node.position);
        
        //移动
        this.nInputMove(input);
        //射击
        input.bullet && this.nIPlayerShoot(input.bullet);

    }

    //执行移动
    nInputMove(input:IPlayer){

        if(input.dir != null || input.speed != null) {
            this.moveDir = input.dir;
        };

        if(input.speed != null) {
            this.moveSpeed = input.speed;
        };

        if(this.moveSpeed === 0) return;

        this.node.angle = misc.radiansToDegrees(Math.atan2(this.moveDir.y, this.moveDir.x)) - 90;
        
        if (this.body) {
            const moveVec = Object.assign(new Vec3(),this.moveDir).multiplyScalar(this.moveSpeed / 20);
            const force = new Vec2(moveVec.x, moveVec.y);
            this.body.applyForceToCenter(force, true);
        }

    }

    
    /**
     * 射击
     */
    iPlayerShoot(){

        console.log("iPlayerShoot");

        let bullet = new ABullet();
        
        bullet.angle = this.node.angle;
        bullet.position = this.node.position;

        this.getInput().bullet = bullet;
        
    }

    /**
     * 执行射击
     */
    nIPlayerShoot(aBullet:ABullet){

        //子弹初始化
        let bullet:Node = instantiate(this.bullet);
        
        //动态添加时 需要调用初始化同步组件
        let bulletController:NBulletController = bullet.getComponent(NBulletController);
        bulletController.dyInit(this,aBullet);

        bullet.angle = aBullet.angle;
        let ration = (aBullet.angle*Math.PI/180) + (Math.PI/2);
        let direction = v2(Math.cos(ration),Math.sin(ration));

        bullet.setPosition(aBullet.position.x + 40 * direction.x,aBullet.position.y + 40 * direction.y);
        this.bulletMap.addChild(bullet);
        
        //射击
        let body = bullet.getComponent(RigidBody2D);
        if (body) {
            body.linearVelocity = direction.normalize().multiply(v2(10,10));
        }

    }

}
