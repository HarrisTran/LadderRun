import { StaticInstance } from './../StaticInstance';
// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import Block from '../Block';
import Camera from '../Camera';
import { Vec2ToVec3, Vec3ToVec2, delay } from '../Utils';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {
    @property(cc.Animation)
    animation : cc.Animation = null;

    @property(cc.Node)
    floatText: cc.Node = null;

    protected onLoad(): void {
        this.animation.on('play', this.onPlay, this);
        this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.COIN){
            this.animation.play('collected')
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
            DataManager.instance.coins += 1;
            DataManager.instance.score += 50
            DataManager.instance.save()
            StaticInstance.uiManager.setGameScore()
        }
    }

    onPlay(){
        if(this.animation.getAnimationState('collected').isPlaying) this.node.removeComponent(cc.Collider)
    }

    async onFinished(){
        cc.tween(this.floatText)
        .by(0.4,{y:20})
        .call(()=>{
            this.node.active = false;
        })
        .start()
        await delay(500);
        StaticInstance.uiManager.spawnCoinAtPosition(this.node.position.clone());
    }

    protected onDestroy(): void {
        this.animation.off('play', this.onFinished, this)
        this.animation.off('finished', this.onFinished, this)
    }

}
