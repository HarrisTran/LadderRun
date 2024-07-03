import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShotCellarTrap extends cc.Component {
    @property(cc.Node) rock : cc.Node = null;
    @property(sp.Skeleton) animation : sp.Skeleton = null;


    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        if (other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW) {
            if (this.animation) {
                let vertexEffect = new sp.VertexEffectDelegate()

                vertexEffect.initJitter(10,4);

                this.animation.setVertexEffectDelegate(vertexEffect)

                let track = this.animation.setAnimation(0, 'break', false);
                this.animation.setTrackCompleteListener(track, (_, __) => {
                    vertexEffect.clear();
                    cc.tween(this.rock)
                        .by(1, { y: -270 }, { easing: "sineIn" })
                        .removeSelf()
                        .call(() => {
                            this.node.removeComponent(cc.Collider)
                            this.animation.setVertexEffectDelegate(vertexEffect)
                            this.animation.setAnimation(0, 'idle', true)
                        })
                        .start();
                })
            } else {
                cc.tween(this.rock)
                    .by(1.2, { y: -270 }, { easing: "sineIn" })
                    .removeSelf()
                    .call(() => this.node.active = false)
                    .start();
            }

            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_FALL)
        }
    }

}
