
import { _decorator, Component, Node, v3 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Camera
 * DateTime = Tue Jan 18 2022 16:31:10 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = Camera.ts
 * FileBasenameNoExtension = Camera
 * URL = db://assets/script/tools/Camera.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('Camera')
export class CameraFollow extends Component {


    @property({
        type: Node,
        tooltip: "跟随的物体",
    })
    fNode:Node | null = null;

    update (deltaTime: number) {
        if(this.fNode){
            this.node.setPosition(v3(this.fNode.getPosition().x,this.fNode.getPosition().y,this.node.position.z))
        }
    }
}