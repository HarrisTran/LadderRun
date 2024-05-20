
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import AudioManager from "../manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HideTrap extends cc.Component {
    @property(cc.Node) body : cc.Node = null;


    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            cc.tween(this.body)
            .to(1,{scaleY: 0})
            .delay(1)
            .to(0.5,{scaleY: 1.5})
            .union()
            .repeat(10)
            .start();
        }
    }

    onCollisionEnd (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            this.body.pauseAllActions();
        }
    }
}
