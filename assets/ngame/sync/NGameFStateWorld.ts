import { instantiate, Node, Prefab } from "cc";
import SNCocosFrameAction from "../../script/ngame/ncontroller/service/SNCocos3DDemoAction";
import NStateMessageProtobuf from "../protobuf/FState/FStateMessage.js";
import ProtoAnyUtil from "../protobuf/ProtoAnyUtil";
import Singleton from "../util/Singleton";
import { uIsNull } from "../util/util-func";
import { newNextId } from "../util/util-ngame";
import NGameFStateComponent from "./component/NGameFStateComponent";
import { NPrefab, NPrefabManager, NSFrameInfo } from "./enity/NStateEnity";

const { NStateMessage, NStateMessages } = NStateMessageProtobuf;

/**
 * 状态帧同步
 */
export default class NGameFStateWorld extends Singleton {
    
    //同步时间 (和服务器保持一致)
    nSyncTime: number = 1 / 15;

    //同步Node
    nSyncActors:Map<number,NGameFStateComponent> = new Map;

    //是否同步
    isStart:boolean = false;

    //同步的Prefabs
    nPrefabs:NPrefabManager;

    //同步世界的Node
    world:Node;

    //记录删除ID
    removeIds:number[] = [];

    idIndex:number = 0;

    //开始同步
    async start(world:Node){

        if(this.isStart){
            return;
        }


        this.nPrefabs = await this.nLoadPrefabs();

        this.isStart = true;
        this.world = world;

        setInterval(this.nUpdate.bind(this),this.nSyncTime * 1000);

    }

    async nLoadPrefabs() {
        return new NPrefabManager;
    };

    addSyncActor(actor: NGameFStateComponent){

        this.nSyncActors.set(actor.nId,actor);

    }
    
    //同步Update
    nUpdate(dt:number){

        this.nUSendMonitor();

    }

    
    //发送消息
    nUSendMonitor(){

        let actors = NStateMessages.create();

        Array.from(this.nSyncActors.values()).forEach(actor => {

            if(!actor.isowner) return;

            let state = NStateMessage.create();
            state.nId = actor.nId;

            let isverify = false;
            actor.monitors.forEach(monitor => {

                if(monitor.key && monitor.verify()){

                    isverify = true;

                    let message = monitor.encode(monitor.message());
                    if(ProtoAnyUtil.isProtobuf(message)){
                        state.states[`${monitor.key}`] = ProtoAnyUtil.pack(message);
                    }else{
                        state.states[`${monitor.key}`] = ProtoAnyUtil.fromObject(message);
                    }


                }

            });

            if(isverify){
                state.prefab = actor.nPrefabKey;
                actors.messages.push(state);
            }

        })

        if(actors.messages.length)
            SNCocosFrameAction.nGameFrameState(actors);

    }

    //发送消息(不进行验证)
    nNvSendMonitor(){

        let actors = NStateMessages.create();

        Array.from(this.nSyncActors.values()).forEach(actor => {

            if(!actor.isowner) return;
            
            let state  = new NStateMessage();
            state.nId = actor.nId;

            actor.monitors.forEach(monitor => {
                if(monitor.key){

                    let message = monitor.encode(monitor.message());
                    if(ProtoAnyUtil.isProtobuf(message)){
                        state.states[`${monitor.key}`] = ProtoAnyUtil.pack(message);
                    }else{
                        state.states[`${monitor.key}`] = ProtoAnyUtil.fromObject(message);
                    }

                }
            });

            state.prefab = actor.nPrefabKey;
            actors.messages.push(state);

        });


        if(actors.messages.length)
            SNCocosFrameAction.nGameFrameState(actors);

    }

    //更新帧状态
    nUpdateFrameState(states:NStateMessageProtobuf.NStateMessages){

        states.messages.forEach(state => {

            //找到Actor
            let actor = this.nSyncActors.get(state.nId)

            //如果没有找到则生成
            if(!actor)
                actor = this.nActorGenerate(state);
            if(!actor || actor.isowner)
                return;

            
            actor.monitors.forEach(monitor => {

                let value:NStateMessageProtobuf.google.protobuf.IAny = null;
                if(!uIsNull(value = state.states[`${monitor.key}`])){

                    if(ProtoAnyUtil.isProtobuf(value)){
                        monitor.modify(monitor.decode(ProtoAnyUtil.unpack(value)),actor.isowner);
                    }else{
                        monitor.modify(monitor.decode(ProtoAnyUtil.toObject(value)),actor.isowner);
                    }
                    
                }
                
            });

        });

    }

    //通过NStateMessage生成Actor
    nActorGenerate(state:NStateMessageProtobuf.INStateMessage){

        //如果之前被删除 则不进行生成
        if(this.removeIds.indexOf(state.nId) != -1) return;

        //找到Prefab生成
        let nprefab:NPrefab = this.nPrefabs.get(state.prefab);

        let actor:NGameFStateComponent = null;

        //如果有则生成
        if(nprefab && nprefab.prefab){

            let node = instantiate(nprefab.prefab);
            actor = node.getComponent(NGameFStateComponent);
            
            actor.isowner = false;
            actor.nId = state.nId;
            node.parent = this.world;

            actor.monitors.forEach(monitor => {

                if(!monitor.key) return;

                let value = state.states[`${monitor.key}`];
                
                if(ProtoAnyUtil.isProtobuf(value)){
                    monitor.init(monitor.decode(ProtoAnyUtil.unpack(value)),actor.isowner);
                }else{
                    monitor.init(monitor.decode(ProtoAnyUtil.toObject(value)),actor.isowner);
                }

            })

            this.nSyncActors.set(actor.nId,actor);

        }

        return actor;

    }

    new(prefab: Prefab) {

        let node = instantiate(prefab);
    
        let comps:NGameFStateComponent[] = node.getComponents(NGameFStateComponent);
    
        comps.forEach(comp => {
            comp.isowner = true;
            comp.nId = parseInt(`${Date.now()}${this.idIndex++}`);

            comp.monitors.forEach(monitor => {
                monitor.init(null,comp.isowner);
            })

        })
    
        if(this.world)
            node.parent = this.world;
    
        return node;
    
    }

    delete(nId: number){

        //删除nSyncActor
        let actor:NGameFStateComponent;
        if(actor = this.nSyncActors.get(nId)){

            //删除
            actor.node.removeFromParent();
            this.nSyncActors.delete(nId);

        }

        this.removeIds.push(nId);

    }

}
