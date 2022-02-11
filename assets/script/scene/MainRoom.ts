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

    timer:number = null;

    async onLoad(){

        //加载房间列表
        this.timer = setInterval(this.nUpdateRoomList.bind(this),1000)

    }

    //更新房间列表
    async nUpdateRoomList(){

        this.nRooms.removeAllChildren();

        //获取房间
        this.rooms = (await JGet("/open/cocos-bridge/rooms")).data;

        this.rooms.forEach(value => {
            //添加房间
            let room = instantiate(this.iRooms);
            let roomItem = room.getComponent(RoomItem);
            roomItem.rNameItem.string = value.uuid;
            roomItem.nServerId = value.uuid;
            roomItem.rNumItem.string = `${value.client}`;
            this.nRooms.addChild(room);
        })

        console.log(`房间列表:`,this.rooms);
    }

    //创建房间
    async nAddRoom(){
        await JGet("/open/add/cocos/state/room",{roomId:Date.now()});
    }

    onDisable(){

        clearInterval(this.timer);

    }

}
