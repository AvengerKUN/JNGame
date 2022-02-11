import { NGameRPCClass, NGameRPCFun } from "../../../../ngame/decorator/NDecorator";
import { NInputMessage, NSyncInput } from "../../NFrameEnity";

@NGameRPCClass
export default class SNCocosFrameAction {
    
    @NGameRPCFun()
    static nHelloWorld(){}

    /**
     * 发送帧输入
     */
    @NGameRPCFun()
    static nGameFrameInput(inputs:Array<NInputMessage>){
        console.log(inputs);
    }
}