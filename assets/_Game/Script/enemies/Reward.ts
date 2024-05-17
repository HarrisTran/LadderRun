import {ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from '../manager/GameManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Reward extends cc.Component {
    @property(cc.Integer)
    private coinValue: number = 0;
    // @property(cc.Animation)
    // animation : cc.Animation = null;

    // @property(cc.Node)
    // floatText: cc.Node = null;

    protected onLoad(): void {
        // this.animation.on('play', this.onPlay, this);
        // this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.REWARD){
            //this.animation.play('collected')
            // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.COLLECT)
            // DataManager.instance.coins += 1;
            // DataManager.instance.score += COIN_VALUE;
            // DataManager.instance.save()
            //StaticInstance.uiManager.setGameScore()

            GameManager.Instance.playerDataManager.addScore(this.coinValue);
            GameManager.Instance.UIManager.setGameScore();

            this.node.removeComponent(cc.Collider);
            this.node.active = false;

        }
    }

    onPlay(){
        //if(this.animation.getAnimationState('collected').isPlaying) this.node.removeComponent(cc.Collider)
    }

    async onFinished(){
        // cc.tween(this.floatText)
        // .by(0.46,{y:48})
        // .delay(0.2)
        // .call(()=>{
        //     this.node.active = false;
        // })
        // .start()
        // await delay(200);
        // StaticInstance.uiManager.spawnCoinAtPosition(this.node.position.clone());
    }

    protected onDestroy(): void {
        // this.animation.off('play', this.onFinished, this)
        // this.animation.off('finished', this.onFinished, this)
    }

}
