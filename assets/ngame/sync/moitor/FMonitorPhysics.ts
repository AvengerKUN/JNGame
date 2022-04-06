import { ERigidBodyType, RigidBody, Vec3 } from "cc";
import NGameFStateComponent from "../component/NGameFStateComponent";
import FStateMonitor from "./FStateMonitor";


export default class FMonitorPhysics extends FStateMonitor<any,any>{

    key: string;
    nComponent:NGameFStateComponent;
    body:RigidBody;
    lastIsOwner:boolean;

    constructor(nComponent:NGameFStateComponent,body:RigidBody){
        super();

        this.nComponent = nComponent;
        this.body = body;

        this.bodyUpdate();


    }

    message(): any {return null;}
    verify(): boolean { return true }
    modify(value: any, isowner: boolean): void {}
    init(value: any, isowner: boolean): void {}
    encode(value: any) {return value;}
    decode(value: any) {return value;}

    bodyUpdate(){

        this.lastIsOwner = this.nComponent.isowner;

        if(this.nComponent.isowner){
            this.body.type = ERigidBodyType.DYNAMIC;
        }else{
            this.body.type = ERigidBodyType.STATIC;
        }

    }

    update(dt: any): void {

        
        if(this.lastIsOwner != this.nComponent.isowner){

            this.bodyUpdate();

        }
        
    }
    
}