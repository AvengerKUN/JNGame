import NGameSyncWorld from "../nscript/NGameSyncWorld";

const {ccclass, property} = cc._decorator;

/**
 * 同步组件
 */
@ccclass
export default abstract class NGameSyncComponent extends cc.Component {

    @property({displayName:'属于那个同步类',type:NGameSyncWorld})
    nGameSyncWorld:NGameSyncWorld = null;

    onLoad(){
        //添加同步Actor
        this.nGameSyncWorld.nSyncActors.push(this);
    }

    /**
     * 同步逻辑帧
     */
    abstract nUpdate(dt:Number);

}