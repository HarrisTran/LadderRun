
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import { delay } from "../Utils";
import AudioManager from "../manager/AudioManager";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoftTrap extends cc.Component {

    //animation: cc.Animation = null

    protected onLoad(): void {
        // this.animation = this.node.getComponent(cc.Animation);
        // this.animation.on('play', this.onPlay, this);
        // this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.SOFT_TRAP_DESTROY){
            this.onFinished();
            //self.node.getComponent(cc.Animation).play("box")
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.SOFT_TRAP_WALL);
        }
    }

    onPlay(){
        //if(this.animation.getAnimationState('box').isPlaying) this.node.removeComponent(cc.Collider)
    }

    onFinished(){
        // await delay(10)
        this.node.getComponentInChildren(sp.Skeleton).setAnimation(0,'break',false);
        this.node.getChildByName('collider').removeComponent(cc.Collider);
        this.node.removeComponent(cc.Collider);
        
    }

    protected onDestroy(): void {
        // this.animation.off('play', this.onFinished, this)
        // this.animation.off('finished', this.onFinished, this)
    }
}
