// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_PLAYER_STATUS } from "../Enum";
import AudioManager from "../manager/AudioManager";
import Player from "../Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Trampoline extends cc.Component {

    animation: cc.Animation = null

    protected onLoad(): void {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on('play', this.onPlay, this);
        this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.TRAMPOLINE){
            self.node.getComponent(cc.Animation).play('trampoline')
            // 弹跳
            // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.JUMP)
            // const player = other.node.getComponent(Player)
            // player.status = ENUM_PLAYER_STATUS.CLIMB
            // player.speed.y = player.jump * 2
        }
    }

    onPlay(){
        if(this.animation.getAnimationState('trampoline').isPlaying) this.node.removeComponent(cc.Collider)
    }

    onFinished(){
        this.node.active = false
    }

    protected onDestroy(): void {
        this.animation.off('play', this.onFinished, this)
        this.animation.off('finished', this.onFinished, this)
    }
}
