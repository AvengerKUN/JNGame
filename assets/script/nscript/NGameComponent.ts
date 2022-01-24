import { CCInteger, Component, _decorator } from "cc";
import { NSyncInput } from "../nenity/NFrameInfo";
import NGameStateWorld from "./NGameStateWorld";
const {ccclass, property} = _decorator;


/**
 * NGame 组件 用来通知操作
 */
 @ccclass
 export default abstract class NGameComponent<InputSync extends NSyncInput> extends Component {

    @property({displayName:'属于那个同步类',type:NGameStateWorld})
    nGameSyncWorld:NGameStateWorld = null;
    
    @property({displayName:'同步ID',type:CCInteger})
    nId:number = null;

    //是否是服务器添加的Actor (默认不是)
    isActorServer:boolean = false;

    //当前输入
    public input:InputSync = null;

    public getInput():InputSync{
        if(!this.input) this.input = this.initInput();
        return this.input;
    }

    //初始化输入对象
    abstract initInput():InputSync;

    onLoad(){
        this.initComponent();
    }
    
    //初始化同步
    initComponent(){
        //将当前Actor 添加 到同步世界中
        this.nGameSyncWorld.nAddComponent(this);
    }
    
    /**
     * 逻辑帧
     * @param dt 同步间隔时间
     */
    abstract nUpdate(dt:number,input:InputSync,nt:number);

 }