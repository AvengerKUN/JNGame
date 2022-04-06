import { _decorator, animation, ParticleSystem } from "cc";
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = AnimationGraphComponent
 * DateTime = Fri Mar 11 2022 17:48:26 GMT+0800 (中国标准时间)
 * Author = xiaoyz
 * FileBasename = AnimationGraphComponent.ts
 * FileBasenameNoExtension = AnimationGraphComponent
 * URL = db://assets/script/graph/AnimationGraphComponent.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass("AnimationGraphComponent")
export class AnimationGraphComponent extends animation.StateMachineComponent {

    /**
     * Called when a motion state right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    // public onMotionStateEnter (controller: animation.AnimationController, stateStatus: Readonly<animation.MotionStateStatus>): void {
    //     console.log(controller,stateStatus);
        
    //     // 播放动画控制器组件所在节点上的所有粒子特效
    //     for (const particleSystem of controller.node.getComponents(ParticleSystem)) {
    //         particleSystem.play();
    //     }
    // }

    // /**
    //  * Called when a motion state is going to be exited.
    //  * @param controller The animation controller it within.
    //  * @param motionStateStatus The status of the motion.
    //  */
    // public onMotionStateExit (controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {
    //     // Can be overrode
    // }

    // /**
    //  * Called when a motion state updated except for the first and last frame.
    //  * @param controller The animation controller it within.
    //  * @param motionStateStatus The status of the motion.
    //  */
    public onMotionStateUpdate (controller: animation.AnimationController, motionStateStatus: Readonly<animation.MotionStateStatus>): void {

        console.log(controller,motionStateStatus);

        // Can be overrode
    }

    // /**
    //  * Called when a state machine right after it entered.
    //  * @param controller The animation controller it within.
    //  */
    // public onStateMachineEnter (controller: animation.AnimationController) {
    //     // Can be overrode
    // }

    // /**
    //  * Called when a state machine right after it entered.
    //  * @param controller The animation controller it within.
    //  */
    // public onStateMachineExit (controller: animation.AnimationController) {
    //     // Can be overrode
    // }
}
