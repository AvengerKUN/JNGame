import { RigidBody2D, Vec2, _decorator } from "cc";
import { NStateSync, NSyncInput } from "../../nenity/NFrameInfo";
import NGameSyncComponent from "../../nscript/NGameSyncComponent";

const { ccclass, property } = _decorator;

class IBullet  extends NSyncInput {
}
class SBullet  extends NStateSync {
    linearDamping:number;
    linearVelocity:Vec2;
    angularDamping:number;
    angularVelocity:number;
}


@ccclass('NBulletController')
export class NBulletController extends NGameSyncComponent<IBullet,SBullet> {

    body: RigidBody2D | null = null;
    
    onLoad(){

        super.onLoad();
        this.body = this.node.getComponent(RigidBody2D);
        
    }

    initInput(): IBullet {
        return new IBullet();
    }

    vGetStateSync(): SBullet {

        let bullet = new SBullet();
        bullet.angle = this.node.angle;
        bullet.position = this.node.position;
        bullet.linearVelocity = this.body.linearVelocity;
        bullet.linearDamping = this.body.linearDamping;
        bullet.angularVelocity = this.body.angularVelocity;
        bullet.angularDamping = this.body.angularDamping;

        return bullet;

    }

    
    /**
     * 同步状态
     */
     nSyncState(state: SBullet) {

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

    nUpdate(dt: number, input: IBullet, nt: number) {

    }
}

