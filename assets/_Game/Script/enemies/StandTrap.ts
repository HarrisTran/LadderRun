
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandTrap extends cc.Component {

    @property(sp.Skeleton)
    private trapAnimation: sp.Skeleton = null;

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.SPIKE){
            this.trapAnimation.setAnimation(0,'attack',false);
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_STAND);
        }
    }

    onCollisionExit (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.SPIKE){
            this.trapAnimation.setAnimation(0,'idle',true);
        }
    }
}
