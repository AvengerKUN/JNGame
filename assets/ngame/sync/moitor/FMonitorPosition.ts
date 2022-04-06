import { Node, Tween, Vec2, Vec3 } from "cc";
import NGameDemoFStateWorld from "../../../script/ngame/NGameDemoFStateWorld";
import { dVec3Retain } from "../../util/NGameUtil";
import FStateMonitor from "./FStateMonitor";
import FStateMessageProtobuf from "../../protobuf/FState/FStateMessage.js";

export default class FMonitorPosition extends FStateMonitor<Vec3,FStateMessageProtobuf.NStateVec3>{

    key: string;

    node:Node;

    //上一次发送的位置
    position:Vec3 = null;

    constructor(node:Node){
        super();

        this.key = "pos";
        this.node = node;
    }

    message(): Vec3{
        this.position = this.node.position.clone();
        return this.node.position.clone();
    }

    verify(): boolean {
        if(!this.position) return true;
        return !((this.node.position.clone()).equals((this.position.clone())));
    }

    modify(value:Vec3,isowner:boolean): void {

        if(isowner){

            this.node.position = value;

        }else{

            //如果不是拥有者则缓动
            new Tween(this.node)
                .to(NGameDemoFStateWorld.ins().nSyncTime,{
                    position:value
                })
                .start();

        }

    }

    init(value: Vec3, isowner: boolean): void { 

        if(value)
            this.node.position = value; 

    }
    
    encode(value: Vec3): FStateMessageProtobuf.NStateVec3 {
        let val = Object.assign(FStateMessageProtobuf.NStateVec3.create(),value);
        return val
    }

    decode(value: FStateMessageProtobuf.NStateVec3): Vec3 {
        return Object.assign(new Vec3(),value)
    }
}

