// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_COLLIDER_TAG } from "../Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PiranhaPlant extends cc.Component {
    piranhaPlant: cc.Node = null;
    actionPlant : cc.Tween<cc.Node> = null;

    protected onLoad(): void {
        this.piranhaPlant = this.node.getChildByName("piranha_plant");
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.PLANT_VIEW){
            this.actionPlant = cc.tween(this.piranhaPlant).sequence(
                cc.tween(this.piranhaPlant).to(1,{y: 0}),
                cc.tween().delay(2),
                cc.tween(this.piranhaPlant).to(1,{y: 40}),
            )
            .repeat(20)
            this.actionPlant.start();
        }
    }

    onCollisionEnd (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.PLANT_VIEW){
            this.onDestroy();
        }
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks();
        this.actionPlant.stop();
    }
}
