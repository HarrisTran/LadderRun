// Created by carolsail

import { ENUM_COLLIDER_TAG} from "../Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Trampoline extends cc.Component {

    //animation: cc.Animation = null

    protected onLoad(): void {
        // this.animation = this.node.getComponent(cc.Animation);
        // this.animation.on('play', this.onPlay, this);
        // this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.TRAMPOLINE){
            self.node.getComponentInChildren(sp.Skeleton)?.setAnimation(0,'animation',false);
        }
    }

    onPlay(){
        //if(this.animation.getAnimationState('trampoline').isPlaying) this.node.removeComponent(cc.Collider)
    }

    onFinished(){
        this.node.active = false
    }

    protected onDestroy(): void {
        //this.animation.off('play', this.onFinished, this)
        //this.animation.off('finished', this.onFinished, this)
    }
}
