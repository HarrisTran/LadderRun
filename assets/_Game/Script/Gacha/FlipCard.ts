import GameManager from "../manager/GameManager";
import GachaManager from "./GachaManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FlipCard extends cc.Component {
    @property(sp.Skeleton) private animation: sp.Skeleton = null;
    @property(cc.Sprite) private cards: cc.Sprite[] = [];

    protected onLoad(): void {
        this.animation.setEventListener((_ : sp.spine.TrackEntry, e: sp.spine.Event) => {
            switch (e.data.name) {
                case 'card1-active':
                    this.cards[0].node.active = true;
                    break;
                case 'card2-active':
                    this.cards[1].node.active = true;
                    break;
                case 'card3-active':
                    this.cards[2].node.active = true;
                    break;
                case 'card4-active':
                    this.cards[3].node.active = true;
                    break;
            }
        });
    }

    protected onEnable(): void {
        this.cards.forEach((card) => card.node.active = false);
        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',true);
    }

    public open1() {
        if (this.cards[0].node.active) return;
        const reward = GameManager.Instance.gachaManager.getReward();
        if (reward) {
            this.cards[0].spriteFrame = reward.icon;
            let track = this.animation.setAnimation(0,`card1-active`, false);
            this.animation.setTrackCompleteListener(track,()=>{
                GameManager.Instance.gachaManager.hide();
            })
            return;
        }
    }

    public open2() {
        if (this.cards[1].node.active) return;
        const reward = GameManager.Instance.gachaManager.getReward();
        if (reward) {
            this.cards[1].spriteFrame = reward.icon;
            let track = this.animation.setAnimation(0,`card2-active`, false);
            this.animation.setTrackCompleteListener(track,()=>{
                GameManager.Instance.gachaManager.hide();
            })
            return;
        }
    }

    public open3() {
        if (this.cards[2].node.active) return;
        const reward = GameManager.Instance.gachaManager.getReward();
        if (reward) {
            this.cards[2].spriteFrame = reward.icon;
            let track = this.animation.setAnimation(0,`card3-active`, false);
            this.animation.setTrackCompleteListener(track,()=>{
                GameManager.Instance.gachaManager.hide();
            })
            return;
        }
    }

    public open4() {
        if (this.cards[3].node.active) return;
        const reward = GameManager.Instance.gachaManager.getReward();
        if (reward) {
            this.cards[3].spriteFrame = reward.icon;
            let track = this.animation.setAnimation(0,`card4-active`, false);
            this.animation.setTrackCompleteListener(track,()=>{
                GameManager.Instance.gachaManager.hide();
            })
            return;
        }
    }

}
