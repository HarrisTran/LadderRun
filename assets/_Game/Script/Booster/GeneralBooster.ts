
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";
import Player from "../Player";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;
var BoosterType = cc.Enum({
    SPEED : 0,
    SHIELD: 1,
    MAGNET: 2,
    RANDOM: 3,
})

@ccclass
export class GeneralBooster extends cc.Component {
    @property({type: BoosterType}) private boosterType = BoosterType.SPEED;
    duration: number = 10;

    onCollisionEnter(other : cc.Collider, self: cc.Collider){
        if(other.tag === ENUM_COLLIDER_TAG.PLAYER){
            switch (this.boosterType) {
                case BoosterType.MAGNET:
                    this.activeMagnetBooster(other);
                    break;
                case BoosterType.SHIELD:
                    this.activeShieldBooster(other);
                    break;
                case BoosterType.SPEED:
                    this.activeSpeedBooster(other);
                    break;
                case BoosterType.RANDOM:
                    switch (Math.floor(Math.random()*3)) {
                        case 0:
                            this.activeMagnetBooster(other);
                            break;
                        case 1:
                            this.activeShieldBooster(other);
                            break;
                        case 2:
                            this.activeSpeedBooster(other);
                            break;
                    }
                    break;
            }

            this.node.removeComponent(cc.Collider);
            this.node.active = false;
        }
    }

    activeSpeedBooster(collider: cc.Collider){
        GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_SPEED)
        collider.node.getComponent(Player).speedBoosterDuration = this.duration;
    }

    activeShieldBooster(collider: cc.Collider){
        GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_SHIELD)
        collider.node.getComponent(Player).shieldBoosterDuration = this.duration;
    }

    activeMagnetBooster(collider: cc.Collider){
        GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_MAGNET)
        collider.node.getComponent(Player).magnetBoosterDuration = this.duration;
    }

}
