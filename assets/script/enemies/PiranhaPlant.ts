// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import AudioManager from "../manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PiranhaPlant extends cc.Component {
    piranhaPlant: cc.Node = null;
    piranhaPlantTemp: cc.Node = null;
    actionPlant : cc.Tween<cc.Node> = null;

    protected onLoad(): void {
        this.piranhaPlantTemp = this.node.getChildByName("mask");
        this.piranhaPlant = this.piranhaPlantTemp.getChildByName("piranha_plant");
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.PLANT_VIEW){
            this.actionPlant = cc.tween(this.piranhaPlant).sequence(
                cc.tween(this.piranhaPlant).to(0.25,{y: 0}),
                cc.tween().delay(0.25),
                cc.tween(this.piranhaPlant).to(0.5,{y: -84}),
                cc.tween().delay(1.5),
            )
            .repeat(20)
            this.actionPlant.start();
        }
    }

    onCollisionEnd (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.PLANT_VIEW){
            this.actionPlant.stop();
        }
    }

    protected onDestroy(): void {
        this.actionPlant.stop();
    }
}
