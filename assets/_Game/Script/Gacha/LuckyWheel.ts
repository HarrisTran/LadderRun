import GameManager from "../manager/GameManager";
import { random, randomInList, shuffle } from "../Utils";

const {ccclass, property} = cc._decorator;
const PRIZE_COUNT = 10;
const BASE_PRIZE_INDEX = 1;
const TIME_TO_SPIN = 5;
@ccclass
export default class LuckyWheel extends cc.Component {
    @property(sp.Skeleton) private animation: sp.Skeleton = null;
    @property(cc.Sprite) private items: cc.Sprite[] = [];

    private _wheelBone: sp.spine.Bone = null;
    private _isClicked: boolean = false;
    private _currPrizeIdx : number = 0;
    private _spinTween: cc.Tween<sp.spine.Bone> = null;

    protected onLoad(): void {
        this._wheelBone = this.animation.findBone('wheel');
    }


    protected onEnable(): void {
        this._isClicked = false;
        this._currPrizeIdx = BASE_PRIZE_INDEX;
        this.animation.setAnimation(0,'appear',false);
        this.animation.addAnimation(0,'idle',true);
        
        let luckyWheelData = shuffle([...GameManager.Instance.gachaManager.rewards])
        for (let i = 0; i < luckyWheelData.length; i++) {
            this.items[i].spriteFrame = luckyWheelData[i].icon;
        }
        const reward = GameManager.Instance.gachaManager.getReward();
        
        let prizeIndex : number = luckyWheelData.findIndex(i=>i.id == reward.id) + 1;

        let rotationPerPrize = 360/PRIZE_COUNT;
        let rotationBw2Idx = prizeIndex - this._currPrizeIdx;
        if(rotationBw2Idx < 0) rotationBw2Idx += PRIZE_COUNT;
        rotationBw2Idx = (rotationBw2Idx - 1)*rotationPerPrize;

        let offset = random(
            Math.floor(rotationPerPrize / 2) + 1,
            Math.floor(rotationPerPrize * 3 / 2) - 1
        )

        let rotation = -(360*5 + rotationBw2Idx + offset);

        this._spinTween = cc.tween(this._wheelBone)
        .by(
            TIME_TO_SPIN,
            {rotation: rotation},
            {easing: 'quintOut'}
        )
        .call(()=>{
            cc.tween(this.items[prizeIndex-1].node)
            .to(0.2,{scale : 1.25})
            .to(0.2,{scale: 1})
            .call(()=> GameManager.Instance.gachaManager.hide())
            .start();
        })
    }

    protected onDisable(): void {
        this._wheelBone.rotation = 0;
        this._wheelBone.update();
    }

    public spin(){
        if(this._isClicked) return;
        this._isClicked = true;
        this.animation.clearTrack(0);
        this._wheelBone.rotation = 0;
        this._wheelBone.update();
        this._spinTween.start();
    }


}
