
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HideTrap extends cc.Component {
    @property(cc.Node) body : cc.Node = null;

    bodyTween: cc.Tween<cc.Node> = null;

    protected start(): void {
        this.bodyTween = cc.tween(this.body)
            .to(0.15,{y: 0})
            .call(()=>GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_HIDE_STAND))
            .delay(0.3)
            .to(0.15,{y: -this.body.height})
            .union()
            .repeat(30)
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            this.bodyTween.start();
        }
    }

    onCollisionEnd (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            this.bodyTween.stop();
        }
    }
}
