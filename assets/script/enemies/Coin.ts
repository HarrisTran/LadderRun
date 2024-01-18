import { StaticInstance } from './../StaticInstance';
// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    animation: cc.Animation = null

    protected onLoad(): void {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on('play', this.onPlay, this);
        this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.COIN){
            this.animation.play('collected')
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
            DataManager.instance.coins += 1
            DataManager.instance.save()
            StaticInstance.uiManager.setGameCoins()
        }
    }

    onPlay(){
        if(this.animation.getAnimationState('collected').isPlaying) this.node.removeComponent(cc.Collider)
    }

    onFinished(){
        this.node.active = false
    }

    protected onDestroy(): void {
        this.animation.off('play', this.onFinished, this)
        this.animation.off('finished', this.onFinished, this)
    }

}
