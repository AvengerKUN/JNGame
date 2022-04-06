import NGameFStateComponent from "../../ngame/sync/component/NGameFStateComponent";
import NGameDemoFStateWorld from "./NGameDemoFStateWorld";


export default class NGameDemoFStateComponent extends NGameFStateComponent{

    onLoad(){
        this.world = NGameDemoFStateWorld.ins();
        super.onLoad();
    }

}

