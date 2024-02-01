
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import AudioManager from "../manager/AudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fruit extends cc.Component {

    animation: cc.Animation = null

    protected onLoad(): void {
        this.animation = this.node.getComponent(cc.Animation);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        const isFruitTag = self.tag == ENUM_COLLIDER_TAG.ANANAS || 
                        self.tag == ENUM_COLLIDER_TAG.MELON;
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && isFruitTag){
            this.animation.play('collected')
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
        }
    }

    onPlay(){
        if(this.animation.getAnimationState('collected').isPlaying) this.node.removeComponent(cc.Collider)
    }

    onFinished(){
        this.node.active = false
    }
}
