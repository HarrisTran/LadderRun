
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
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_MAGNET)
                    this.activeMagnetBooster(other);
                    break;
                case BoosterType.SHIELD:
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_SHIELD)
                    this.activeShieldBooster(other);
                    break;
                case BoosterType.SPEED:
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_SPEED)
                    this.activeSpeedBooster(other);
                    break;
                case BoosterType.RANDOM:
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_RANDOM)
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
        collider.node.getComponent(Player).speedBoosterDuration = this.duration;
    }

    activeShieldBooster(collider: cc.Collider){
        collider.node.getComponent(Player).shieldBoosterDuration = this.duration;
    }

    activeMagnetBooster(collider: cc.Collider){
        collider.node.getComponent(Player).magnetBoosterDuration = this.duration;
    }

}
