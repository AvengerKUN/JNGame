import { Prefab,Node } from "cc";
import { NPrefabManager } from "../../ngame/sync/enity/NStateEnity";
import NGameFStateWorld from "../../ngame/sync/NGameFStateWorld";
import { dLoadPrefab } from "../../ngame/util/NGameUtil";
import SNCocos3DDemoAction from "./ncontroller/service/SNCocos3DDemoAction";
import NGameDemoFStateComponent from "./NGameDemoFStateComponent";

export enum EPrefab {

    PLAYER = 1,//玩家
    BOX = 2,//方块

}

/**
 * 状态帧同步世界
 */
 export default class NGameDemoFStateWorld extends NGameFStateWorld {

    constructor(){

        super();
        //设置同步时间
        this.nSyncTime = 1 / 10;

    }

    async nLoadPrefabs() {

        let prefabs = new NPrefabManager();

        prefabs.add(EPrefab.PLAYER,await dLoadPrefab("prefab/player"));
        prefabs.add(EPrefab.BOX,await dLoadPrefab("prefab/box"));
        console.log("nLoadPrefabs: ",prefabs);

        return prefabs;

    }

    /**
     * 初始化本地Prefab 玩家断开则Node消失
     */
    newLocal(prefab:Prefab): Node{
        let node = super.new(prefab);
        let nComponent = node.getComponent(NGameDemoFStateComponent);
        //向服务器添加离线ID
        if(nComponent) SNCocos3DDemoAction.nAddLocalId(nComponent.nId);
        return node;
    }

    /**
     * 初始化世界Prefab
     */
    newWorld(prefab:Prefab): Node{
        let node = super.new(prefab);
        let nComponent = node.getComponent(NGameDemoFStateComponent);
        //向服务器添加离线ID
        if(nComponent) SNCocos3DDemoAction.nAddWorldId(nComponent.nId);
        return node;
    }

 }
