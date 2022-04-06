
import { _decorator, Component, Node, RigidBody } from 'cc';
import FMonitorPhysics from '../../ngame/sync/moitor/FMonitorPhysics';
import { EPrefab } from '../ngame/NGameDemoFStateWorld';
import { NDefaultController } from './NDefaultController';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = StoneController
 * DateTime = Fri Apr 01 2022 17:03:09 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = StoneController.ts
 * FileBasenameNoExtension = StoneController
 * URL = db://assets/script/ncontroller/StoneController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('BoxController')
export class BoxController extends NDefaultController {

    nPrefabKey:any = EPrefab.BOX;

    onLoad(){

        super.onLoad();

        this.addMonitor("physics",new FMonitorPhysics(this,this.getComponent(RigidBody)))

    }

}
