import { Component, instantiate, Label, Node, Prefab, v3, _decorator } from "cc";
import FStateMessageProtobuf from "../../ngame/protobuf/FState/FStateMessage.js";
import NGameDemoFStateWorld, { EPrefab } from "../ngame/NGameDemoFStateWorld";

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component{

    @property({displayName:'同步的世界',type:Node})
    world:Node;

    @property({displayName:'同步提示',type:Label})
    nSyncText:Label;


    start(){


        console.log(FStateMessageProtobuf.NStateVec3.decode(FStateMessageProtobuf.NStateVec3.encode(Object.assign(FStateMessageProtobuf.NStateVec3.create(),{x:0.55151168481,y:0.84118811817,z:114711.515151})).finish()));
        
        
    }

    async onLoad(){

        let nworld = NGameDemoFStateWorld.ins();
        //开始同步
        await nworld.start(this.world);

        let nPerfabs = nworld.nPrefabs;

        //开始同步
        await nworld.start(this.world);
        let player = nworld.newLocal(nPerfabs.get(EPrefab.PLAYER).prefab);
        let box = nworld.newLocal(nPerfabs.get(EPrefab.BOX).prefab);

        let player1 = nworld.newWorld(nPerfabs.get(EPrefab.PLAYER).prefab);
        let box1 = nworld.newWorld(nPerfabs.get(EPrefab.BOX).prefab);

        box.position = box.position.add(v3(4,10,0));
        box1.position = box1.position.add(v3(-4,10,0));
        player1.position = player1.position.add(v3(-2,0,0));

    }

    update(){

        this.nSyncText.string = `当前同步组件:${NGameDemoFStateWorld.ins().nSyncActors.size}`;

    }


}

