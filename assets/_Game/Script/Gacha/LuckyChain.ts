import GameManager from "../manager/GameManager";
import { RewardConfig } from "./GachaManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LuckyChain extends cc.Component {
    @property(sp.Skeleton) animation : sp.Skeleton = null;
    @property(cc.Sprite) card5: cc.Sprite = null;
    @property(cc.Sprite) card4: cc.Sprite = null;
    @property(cc.Sprite) card3: cc.Sprite = null;
    @property(cc.Sprite) card2: cc.Sprite = null;
    @property(cc.Sprite) card1: cc.Sprite = null;

    private _currCycleIndex : number = 0;
    private _luckyChainData: RewardConfig[] = []

    protected onLoad(): void {
        this._luckyChainData = [...GameManager.Instance.gachaManager.rewards];
        this.refreshSpriteChain();
        this.animation.setEventListener((_: sp.spine.TrackEntry, e: sp.spine.Event)=>{
            switch (e.data.name) {
                case 'card-claimed':
                    this.card1.node.active = false;
                    this.card5.node.active = false;
                    break;
                case 'new-card-spawned':
                    this.card5.node.active = true;
                    this._currCycleIndex++;
                    break;
            }
        })
    }

    protected onEnable(): void {
        this.card1.node.active = true;
        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',false);
        let track = this.animation.addAnimation(0,'active',false);
        this.animation.setTrackCompleteListener(track,()=>{
            GameManager.Instance.gachaManager.hide();
        })
    }

    refreshSpriteChain(){
        let rewardNewCardSpawned = this.getGroupReward(this._luckyChainData, this._currCycleIndex);
        this.card1.spriteFrame = rewardNewCardSpawned[0].icon;
        this.card2.spriteFrame = rewardNewCardSpawned[1].icon;
        this.card3.spriteFrame = rewardNewCardSpawned[2].icon;
        this.card4.spriteFrame = rewardNewCardSpawned[3].icon;
        this.card5.spriteFrame = rewardNewCardSpawned[4].icon;
        this.card5.node.active = false;
    }

    protected onDisable(): void {
        this.refreshSpriteChain();
    }

    getGroupReward(arr: RewardConfig[], index: number) {
        const n = arr.length;
        let group : RewardConfig[] = [];
        for (let i = 0; i < 5; i++) {
            const nextIndex = (index + i) % n;
            group.push(arr[nextIndex]);
        }
        return group;
    }
}
