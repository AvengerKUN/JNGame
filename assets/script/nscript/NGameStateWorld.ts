
import { _decorator, Component, Enum } from 'cc';

const {ccclass, property} = _decorator;

/**
 * 处理状态同步的核心类
 */
@ccclass
export default class NGameStateWorld extends Component {

    //当前连接的服务器
    nServerId:String = null;

}