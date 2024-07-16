
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_GAME_EVENT } from "../Enum";
import GameManager from "../manager/GameManager";
import Player from "../Player";
import { delay } from "../Utils";

const { ccclass, property } = cc._decorator;
var BoosterType = cc.Enum({
    SPEED: 0,
    SHIELD: 1,
    MAGNET: 2,
})

@ccclass
export class GeneralBooster extends cc.Component {
    @property({ type: BoosterType }) private boosterType = BoosterType.SPEED;

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag === ENUM_COLLIDER_TAG.PLAYER) {
            switch (this.boosterType) {
                case BoosterType.MAGNET:
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_MAGNET)
                    cc.game.emit(ENUM_GAME_EVENT.CLAIM_MAGNET_BOOSTER)
                    break;
                case BoosterType.SHIELD:
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_SHIELD)
                    cc.game.emit(ENUM_GAME_EVENT.CLAIM_SHIELD_BOOSTER)
                    break;
                case BoosterType.SPEED:
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.BOOSTER_SPEED)
                    cc.game.emit(ENUM_GAME_EVENT.CLAIM_SPEED_BOOSTER)
                    break;
            }

            this.node.removeComponent(cc.Collider);
            this.node.active = false;
        }
    }

}
