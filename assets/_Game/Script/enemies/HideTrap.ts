
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import AudioManager from "../manager/AudioManager";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HideTrap extends cc.Component {
    @property(cc.Node) body : cc.Node = null;


    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            let bodyHeight = this.body.height;
            cc.tween(this.body)
            .to(0.15,{y: 0})
            .call(()=>GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_HIDE))
            .delay(0.3)
            .to(0.15,{y: -bodyHeight})
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
