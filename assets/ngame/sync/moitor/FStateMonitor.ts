import { Vec3 } from "cc";


/**
 * 状态帧同步 监听 类
 */
export default abstract class FStateMonitor<T,V>{

    key:string;


    abstract message(): T;

    //验证
    abstract verify(): boolean;

    //期间修改
    abstract modify(value:T,isowner:boolean): void;

    //初始化
    init(value:T,isowner:boolean): void {};

    //update
    update(dt): void {};

    abstract encode(value: T): V;
    abstract decode(value: V): T;
    
}
