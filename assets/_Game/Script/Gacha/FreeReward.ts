import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FreeReward extends cc.Component {
    @property(sp.Skeleton) animation : sp.Skeleton = null;
    @property(cc.Sprite) gift : cc.Sprite = null;

    private _opened: boolean = false;

    protected onLoad(): void {
        this.animation.setEventListener((_ : sp.spine.TrackEntry, e: sp.spine.Event) => {
            switch (e.data.name) {
                case 'open':
                    this.gift.node.active = true;
                    break;
            }
        });
    }

    protected onEnable(): void {
        this._opened = false;
        this.gift.node.active = false;
        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',true);
    }

    public open(){
        if (this._opened) return;
        this._opened = true;
        const reward = GameManager.Instance.gachaManager.getReward();
        if (reward) {
            this.animation.setAnimation(0,'open',false);
            this.gift.spriteFrame = reward.icon;
            return;
        }
    }
}
