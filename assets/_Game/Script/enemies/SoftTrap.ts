
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_PLAYER_STATUS } from "../Enum";
import GameManager from "../manager/GameManager";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoftTrap extends cc.Component {
    @property(sp.Skeleton) body: sp.Skeleton = null;
    @property(cc.Node) collider: cc.Node = null;


    protected onLoad(): void {
        
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

    async onFinished(){
        await delay(10)

        this.collider.getComponent(cc.Collider).enabled = false;
        
        this.body.setAnimation(0,'break',false);
        this.body.setCompleteListener(()=>{
            this.collider.getComponent(cc.Collider).enabled = false;
            this.node.active = false;
        })
    }

    protected onDestroy(): void {
        // this.animation.off('play', this.onFinished, this)
        // this.animation.off('finished', this.onFinished, this)
    }
}
