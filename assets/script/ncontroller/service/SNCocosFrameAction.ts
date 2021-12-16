import { NGameRPCClass, NGameRPCFun } from "../../../ngame/decorator/NDecorator";

@NGameRPCClass
export default class SNCocosFrameAction {
    
    @NGameRPCFun()
    static nHelloWorld(){}

}