
import { _decorator, Component, Node, Label } from 'cc';
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
}
