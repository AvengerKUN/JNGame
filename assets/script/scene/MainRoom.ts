import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { JGet } from '../../axios';
import { RoomItem } from './room/RoomItem';
const { ccclass, property } = _decorator;

 
@ccclass('MainRoom')
export class MainRoom extends Component {

    //房间列表
    rooms:Array<any> = null;

    //房间列表node
    @property({displayName:'房间列表node',type:Node})
    nRooms:Node = null;

    //房间列表的Item
    @property({displayName:'房间item',type:Prefab})
    iRooms:Prefab = null;

    async onLoad(){
        //加载房间列表
        this.nUpdateRoomList();
    }

    //更新房间列表
    async nUpdateRoomList(){

        //获取房间
        this.rooms = (await JGet("/open/cocos-bridge/rooms")).data;

        this.rooms.forEach(value => {
            //添加房间
            let room = instantiate(this.iRooms);
            let roomItem = room.getComponent(RoomItem);
            roomItem.rNameItem.string = value.uuid;
            roomItem.rNumItem.string = `${value.client}`;
            this.nRooms.addChild(room);
        })

        console.log(`房间列表:`,this.rooms);
    }

}
