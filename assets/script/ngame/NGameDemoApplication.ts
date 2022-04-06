import { _decorator } from "cc";
import NGameApplication from "../../ngame/network/NGameApplication";
import NGameDemoFStateWorld from "./NGameDemoFStateWorld";

const {ccclass, property} = _decorator;

@ccclass
export default class NGameDemoApplication extends NGameApplication{

    async onLoad(){
        super.onLoad();
    }

    nWsPath(path){
        return `${path}/${Date.now()}`
    }

}
