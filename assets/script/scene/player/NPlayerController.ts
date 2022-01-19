import { _decorator } from "cc";
import { NSyncInput } from "../../nenity/NFrameInfo";
import NGameSyncComponent, { NStateSync } from "../../nscript/NGameSyncComponent";

const { ccclass, property } = _decorator;

//创建属于自己的控制类 和 同步类
class IPlayer extends NSyncInput{

}
class SPlayer extends NStateSync{

}

@ccclass('NPlayerController')
export default class NPlayerController extends NGameSyncComponent<IPlayer,SPlayer> {

    
}
