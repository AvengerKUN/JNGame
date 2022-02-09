
import { _decorator, Component, Node, Label, director } from 'cc';
import { UserInfo } from '../../data/UserData';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = RoomItem
 * DateTime = Mon Jan 17 2022 17:04:16 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = RoomItem.ts
 * FileBasenameNoExtension = RoomItem
 * URL = db://assets/script/scene/room/RoomItem.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */
 
@ccclass('RoomItem')
export class RoomItem extends Component {
    
    @property({displayName:'服务器名称Item',type:Label})
    rNameItem:Label = null;
    @property({displayName:'服务器人数Item',type:Label})
    rNumItem:Label = null;

    //场景ID
    nServerId:string = null;

    start(){

        //如果有场景ID 则 激活点击事件
        if(this.nServerId){
            this.node.on(Node.EventType.TOUCH_END,this.loadScene,this)
        }
        
    }

    loadScene(){

        //更改服务器ID
        UserInfo.nServerID = this.nServerId;
        director.loadScene("scene");

    }



}
