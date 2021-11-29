// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { CNGameAction } from "../controller/client/CNGameAction";
import SNGameAction from "../controller/server/SNGameAction";
import GAction from "../entity/action/GAction";
import GOwner from "../entity/GOwner";
import NSyncComponent from "../rpc/NSyncComponent";

const {ccclass, property} = cc._decorator;

/**
 * 权限：
 * 
 * 用户操作(在本地权限最大):999999999 -> 服务器根据用户操作(返回服务器对于用户操作的权限 进行分发) : index —> 物理影响(通过用户的操作影响了其他Action 则 其他Action继承权限大小)
 * 
 */

@ccclass
export default class ActionSync extends NSyncComponent {

    deltaLast:any = null;
    uTween:any = null;
    isTouch:boolean = false;
    delayType:cc.RigidBodyType = null;
    @property(cc.Label)
    text:cc.Label = null;
    upindex:number = 0;

    // 最新更新时间
    // latestTime:number = 0;

    // onLoad () {}

    onLoad () {
        // super.start();

        // this.setIsOwner(this.isOwner);

        let that = this;

        //添加控制方法
        this.addFunOwner(`joinGame`)
        this.addFunOwner(`tStart`)
        // console.log(this.addFunOwner(`tMove`));
        // console.log(this.addFunOwner(`tEnd`));
        //添加同步参数
        this.addSyncInfo(`node.position`)
        this.addSyncInfo(`node.angle`)

        this.node.on(cc.Node.EventType.TOUCH_START, this.tStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.tMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.tEnd, this);

        // let rigidBody = this.getComponent(cc.RigidBody);
        // rigidBody.enabledContactListener = true;
        
        //打印同步参数
    }

    setPhysicsType(type:cc.RigidBodyType){

        // let circle:cc.CircleCollider = this.getComponent(cc.CircleCollider);
        let rigidBody = this.getComponent(cc.RigidBody);

        // switch (type) {
        //     case cc.RigidBodyType.Dynamic:
        //         circle.enabled = false;
        //         break;
        //     case cc.RigidBodyType.Static:
        //         circle.enabled = true;
        //         break;
        // }

        rigidBody.type = type;

    }

    nUpCallBack(keys: any) {

        //如果自己权限最大则提交
        if(!this.isOwner()) return;

        let that = this;

        let action:GAction = new GAction();
        keys.forEach(key => {
            
            switch(key){
                case 'node.position':
                    action.position = cc.v2();
                    Object.assign(action.position,(<cc.Vec2>that.keyValue(key)))
                    break;
                case 'node.angle':
                    action.angle = that.keyValue(key);
                    break;
            }

        });
        
        action.uid = this.node.name;

        SNGameAction.nGameSyncSave(action);
    }

    uServerData(data: GAction) {


        
        //如果权限不属于我则修改位置
        if(this.isOwner()) return;

        //如果被服务器通知则取消本地物理
        this.setPhysicsType(cc.RigidBodyType.Static);

        let position = cc.v3(this.node.x,this.node.y);
        let angle = this.node.angle;
        if(data.position){
            position.x = data.position[0];
            position.y = data.position[1];
        }
        if(data.angle){
            angle = data.angle;
        }

        cc.tween(this.node)
            .to(this.checkTime,{position,angle:angle})
            .start()

    }
    
    update(dt: number){
        super.update(dt);

        this.text.string = `${this.isOwner()}`;
    }

    //加入游戏
    joinGame(){
    }

    tStart(event){

        this.setPhysicsType(cc.RigidBodyType.Static);

        this.isTouch = true;

    }
    tMove(event){

        let delta = event.touch.getDelta();

        this.deltaLast = delta;

        this.node.x += delta.x;
        this.node.y += delta.y;

    }
    tEnd(event){
        
        let rigidBody = this.getComponent(cc.RigidBody);
        this.setPhysicsType(cc.RigidBodyType.Dynamic);
        if(this.deltaLast){
            
            let v = rigidBody.linearVelocity;
            v.x = this.deltaLast.x*100;
            v.y = this.deltaLast.y*100;
            rigidBody.linearVelocity = v;
            
            this.deltaLast = null;
        }


        let circle:cc.CircleCollider = this.getComponent(cc.CircleCollider);
        circle.enabled = false;
        
        this.isTouch = false;
    }

    onBeginContact(contact, selfCollider, otherCollider){
        this.onCollisionEnter(otherCollider,selfCollider);
    }

    onCollisionEnter(otherCollider, selfCollider){

        let selfAction:ActionSync = selfCollider.getComponent(ActionSync);
        let otherAction:ActionSync = otherCollider.getComponent(ActionSync);

        if (selfAction && otherAction && selfAction.isOwner() && !otherAction.isOwner()) {
            this.scheduleOnce(() => {
                otherAction.upPhysicsOwner(selfAction.mOwner)
            },0)
        }

    }

    upPhysicsOwner(im:number){

        if(im <= this.oOwner) return;

        this.mOwner = im;

        let rigidBody = this.getComponent(cc.RigidBody);
        if (this.isTouch) {
            rigidBody.type = cc.RigidBodyType.Static;
        }else{
            rigidBody.type = cc.RigidBodyType.Dynamic;
        }

        let owner = new GOwner();
        owner.uid = this.node.name;
        owner.v = this.mOwner;
        SNGameAction.nGameSyncAuth(owner);
    }

    // upRigidBody(){

    //     let rigidBody = this.getComponent(cc.RigidBody);

    //     if (this.isTouch) {
    //         rigidBody.type = cc.RigidBodyType.Static;
    //     }else{
    //         rigidBody.type = cc.RigidBodyType.Dynamic;
    //     }

    // }

    // onPreSolve(contact, selfCollider, otherCollider){

    //     this.delayType = null;
        
    //     let selfActionSync:ActionSync = null;
    //     let otherActionSync:ActionSync = null;
        
    //     if(
    //         (selfActionSync = selfCollider.getComponent(ActionSync)) 
    //         && (otherActionSync = otherCollider.getComponent(ActionSync))
    //         && !selfActionSync.isTouch && !otherActionSync.isTouch
    //         && otherActionSync.isOwner
    //     ){

    //         //如果别人是动态 则 传递接收
    //         let selfRigidBody = selfCollider.getComponent(cc.RigidBody);
    //         let otherRigidBody = otherCollider.getComponent(cc.RigidBody);

    //         if(otherRigidBody.type === cc.RigidBodyType.Dynamic && selfRigidBody.type !== cc.RigidBodyType.Dynamic){
    //             this.scheduleOnce(() => {
    //                 selfActionSync.isOwner = true;
    //                 selfRigidBody.type = cc.RigidBodyType.Dynamic;
    //             },0)
    //             // selfRigidBody.type = cc.RigidBodyType.Dynamic;
    //         }

    //     }
    // }

    // onEndContact(){

    //     console.log('onEndContact');
        
    //     // if(this.delayType){
    //     //     console.log(this.delayType);
    //     //     this.getComponent(cc.RigidBody).type = this.delayType;
    //     // }

    //     // this.delayType = null;

    // }
}
