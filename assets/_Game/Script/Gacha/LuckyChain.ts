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

    protected onLoad(): void {
        let luckyChainData = [...GameManager.Instance.gachaManager.rewards];
        this.animation.setEventListener((_: sp.spine.TrackEntry, e: sp.spine.Event)=>{
            switch (e.data.name) {
                case 'card-claimed':
                    this.card1.node.active = false;
                    this.card5.node.active = false;
                    let rewardCardClaimed = this.getGroupReward(luckyChainData,this._currCycleIndex);
                    this.card1.spriteFrame = rewardCardClaimed[0].icon;
                    this.card2.spriteFrame = rewardCardClaimed[1].icon;
                    this.card3.spriteFrame = rewardCardClaimed[2].icon;
                    this.card4.spriteFrame = rewardCardClaimed[3].icon;
                    this.card5.spriteFrame = rewardCardClaimed[4].icon;
                    
                    break;
            
                case 'new-card-spawned':
                    this.card1.node.active = false;
                    this.card5.node.active = true;
                    this._currCycleIndex++;
                    let rewardNewCardSpawned = this.getGroupReward(luckyChainData,this._currCycleIndex);
                    this.card1.spriteFrame = rewardNewCardSpawned[0].icon;
                    this.card2.spriteFrame = rewardNewCardSpawned[1].icon;
                    this.card3.spriteFrame = rewardNewCardSpawned[2].icon;
                    this.card4.spriteFrame = rewardNewCardSpawned[3].icon;
                    this.card5.spriteFrame = rewardNewCardSpawned[4].icon;
                    
                    break;
            }
        })
    }

    protected onEnable(): void {
        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',false);
        this.animation.addAnimation(0,'active',false);
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
