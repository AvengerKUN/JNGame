import { Node, Tween, Vec2, Vec3 } from "cc";
import NGameDemoApplication from "../../../script/ngame/NGameDemoApplication";
import NGameDemoFStateWorld from "../../../script/ngame/NGameDemoFStateWorld";
import { dVec3Retain } from "../../util/NGameUtil";
import FStateMonitor from "./FStateMonitor";
import FStateMessageProtobuf from "../../protobuf/FState/FStateMessage.js";


export default class FMonitorEulerAngles extends FStateMonitor<Vec3,FStateMessageProtobuf.NStateVec3>{

    key: string;

    node:Node;

    eulerAngles:Vec3 = null;

    constructor(node:Node){
        super();

        this.key = "eangles";
        this.node = node;
    }

    message(): Vec3{
        this.eulerAngles = this.node.eulerAngles.clone();
        return this.node.eulerAngles.clone();
    }

    verify(): boolean {
        if(!this.eulerAngles) return true;
        return !((this.node.eulerAngles.clone()).equals((this.eulerAngles.clone())));
    }

    modify(value:Vec3,isowner:boolean): void {

        if(isowner){
            this.node.eulerAngles = value;
        }else{

            //如果不是拥有者则缓动
            new Tween(this.node)
                .to(NGameDemoFStateWorld.ins().nSyncTime,{
                    eulerAngles:value
                })
                .start();

        }

    }

    init(value: Vec3, isowner: boolean): void { 

        if(value)
            this.node.eulerAngles = value; 

    }

    encode(value: Vec3): FStateMessageProtobuf.NStateVec3 {
        return Object.assign(FStateMessageProtobuf.NStateVec3.create(),value)
    }

    decode(value: FStateMessageProtobuf.NStateVec3): Vec3 {
        return Object.assign(new Vec3(),value)
    }
}

