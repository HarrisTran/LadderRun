
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_PLAYER_STATUS } from "../Enum";
import GameManager from "../manager/GameManager";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoftTrap extends cc.Component {

    animation: sp.Skeleton = null

    protected onLoad(): void {
        this.animation = this.node.getComponentInChildren(sp.Skeleton)
        // this.animation.on('play', this.onPlay, this);
        // this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.SOFT_TRAP){
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

        this.node.removeComponent(cc.BoxCollider);

        this.animation.setAnimation(0,'break',false);
        this.animation.setCompleteListener(()=>{
            this.node.active = false;
        })
    }

    protected onDestroy(): void {
        // this.animation.off('play', this.onFinished, this)
        // this.animation.off('finished', this.onFinished, this)
    }
}
