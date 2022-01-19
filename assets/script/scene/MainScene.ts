
import { _decorator, Component, Node, director, v2, PhysicsSystem2D } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = MainScene
 * DateTime = Tue Jan 18 2022 10:00:19 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = MainScene.ts
 * FileBasenameNoExtension = MainScene
 * URL = db://assets/script/scene/MainScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('MainScene')
export class MainScene extends Component {
    start () {
        
        PhysicsSystem2D.instance.autoSimulation = false;
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.gravity = v2();

    }
}
