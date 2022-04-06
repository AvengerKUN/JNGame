import { v3, _decorator } from "cc";
import { NPrefabManager } from "../../ngame/sync/enity/NStateEnity";
import FMonitorPosition from "../../ngame/sync/moitor/FMonitorPosition";
import NGameDemoFStateComponent from "../ngame/NGameDemoFStateComponent";
import NGameDemoFStateWorld, { EPrefab } from "../ngame/NGameDemoFStateWorld";
import { NDefaultController } from "./NDefaultController";
const { ccclass, property } = _decorator;


@ccclass('PlayerController')
export class PlayerController extends NDefaultController{

    nPrefabKey:any = EPrefab.PLAYER;

    update(){

        this.nPosition = this.nPosition.add(v3(0,0,0.003));
        this.nEulerAngles = this.nEulerAngles.add(v3(0,1,0));
        
    }

}

