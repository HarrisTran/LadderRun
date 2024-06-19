
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HardTrap extends cc.Component {

    //animation: cc.Animation = null

    protected onLoad(): void {
        // this.animation = this.node.getComponent(cc.Animation);
        // this.animation.on('play', this.onPlay, this);
        // this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HARD_TRAP_STAND){
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.HARD_TRAP_WALL);
        }
    }


}
