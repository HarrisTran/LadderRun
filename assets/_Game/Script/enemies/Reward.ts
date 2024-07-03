import {ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_GAME_EVENT } from "../Enum";
import GameManager from '../manager/GameManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Reward extends cc.Component {
    @property(cc.Integer)
    private coinValue: number = 0;
   
    isAttracted : boolean = false;
    targetPos: cc.Vec2 ;

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.REWARD){
            GameManager.Instance.audioManager.playSfx(this.coinValue > 100 ? ENUM_AUDIO_CLIP.REWARD2: ENUM_AUDIO_CLIP.REWARD1);
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


}
