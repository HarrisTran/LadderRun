import {ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_GAME_EVENT } from "../Enum";
import GameManager from '../manager/GameManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Reward extends cc.Component {
    @property(cc.Integer)
    private coinValue: number = 0;
   
    isAttracted : boolean = false;
    targetPos: cc.Vec2 ;

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
            GameManager.Instance.audioManager.playSfx(this.coinValue > 100 ? ENUM_AUDIO_CLIP.REWARD2: ENUM_AUDIO_CLIP.REWARD1);
            GameManager.Instance.playerDataManager.addScore(this.coinValue);
            cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,this.coinValue);
            
            cc.game.emit(ENUM_GAME_EVENT.EFFECT_PICKUP_COIN,{pos: this.node.parent.parent.convertToWorldSpaceAR(this.node.position.clone()),type: this.coinValue > 100 ? 'diamond' : 'coin'})

            this.node.removeComponent(cc.Collider);
            this.node.destroy();

        }
    }

    getRewardFromMagnet(){
        this.isAttracted = true;
    }

    protected update(dt: number): void {
        if(this.isAttracted){
            this.targetPos = this.node.parent.convertToNodeSpaceAR(GameManager.Instance.getPlayerRelativePosition());
            let currentPos = this.node.getPosition();
            this.node.setPosition(currentPos.lerp(this.targetPos,0.25,currentPos))
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
