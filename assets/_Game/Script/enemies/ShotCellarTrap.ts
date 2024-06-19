import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShotCellarTrap extends cc.Component {
    @property(cc.Node) rock : cc.Node = null;

    //animation: cc.Animation = null
    
    protected onLoad(): void {
        //this.animation = this.node.getComponent(cc.Animation);
        this.rock = this.node.getChildByName("rock");
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            let animation = this.node.getChildByName('body');
            if(animation){
                let track = animation.getComponent(sp.Skeleton).setAnimation(0,'break',false);
                animation.getComponent(sp.Skeleton).setTrackCompleteListener(track,(_,__)=>{
                    cc.tween(this.rock)
                    .by(1, { y: -270 }, { easing: "sineIn" })
                    .removeSelf()
                    .call(() => {
                        this.node.removeComponent(cc.Collider)
                        animation.getComponent(sp.Skeleton).setAnimation(0,'idle',true)
                    })
                    .start();
                })
            }else{
                this.playFallObstacle();
            }
            
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_FALL)
        }
    }

    playFallObstacle() {
        cc.tween(this.rock)
            .by(1.2, { y: -270 }, { easing: "sineIn" })
            .removeSelf()
            .call(() => this.node.active = false)
            .start();
    }
}
