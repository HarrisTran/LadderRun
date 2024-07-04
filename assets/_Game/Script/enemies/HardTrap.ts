
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HardTrap extends cc.Component {


    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HARD_TRAP_STAND){
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.HARD_TRAP_WALL);
        }
    }


}
