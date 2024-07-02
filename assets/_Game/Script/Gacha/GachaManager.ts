import { randomInList } from "../Utils";

const { ccclass, property } = cc._decorator;

export var GachaType = cc.Enum({
    FreeReward: 0,
    LuckyWheel: 1,
    LuckyChain: 2,
    FlipCard: 3,
})

@ccclass('Gacha')
class Gacha {
    @property({ type: GachaType })
    public type: number = GachaType.FreeReward;
    @property(cc.Node)
    public gacha: cc.Node = null;
}

var RewardType = cc.Enum({
    SPEED: 0,
    SHIELD: 1,
    MAGNET: 2,
    RANDOM: 3,
    COIN: 4,
})

@ccclass('RewardConfig')
export class RewardConfig {
    @property(cc.String)
    public id: string = '';
    @property({ type: RewardType })
    public type: number = RewardType.MAGNET;
    @property(cc.SpriteFrame)
    public icon: cc.SpriteFrame = null;
}

@ccclass
export default class GachaManager extends cc.Component {

    @property(cc.Node) background: cc.Node = null;
    @property(cc.Node) panelContent: cc.Node = null;

    @property([Gacha]) gachas: Gacha[] = [];
    @property([RewardConfig]) rewards: RewardConfig[] = [];

    private _reward: RewardConfig;
    private _showingGachaType: number;

    public getReward(): RewardConfig {
        this._reward = randomInList(this.rewards);
        return this._reward;
    }

    show(gachaType: number) {
        this._showingGachaType = gachaType;
        this.animateShow();
    }

    protected async animateShow() {
        this.node.active = true;
        this.panelContent.scale = 0;
        this.background.opacity = 0;
        this.onShowStart();
        this.TweenShowScalePopUp(this.panelContent, 0.5, 1).start();
        this.TweenShowAlphaBG(this.background, 0.5).start();
        this.scheduleOnce(()=>{
            this.onShowEnd();
        })

    }

    onShowStart(){
    }

    onShowEnd(){
        let gacha = this.gachas.find((gacha)=>gacha.type === this._showingGachaType)
        gacha.gacha.active = true;
    }

    protected TweenShowScalePopUp(target: cc.Node, time: number, scale: number): cc.Tween<cc.Node> {
        return cc.tween(target).to(time, { scale: scale }, { easing: 'backOut' })
    }

    protected TweenShowAlphaBG(target: cc.Node, time: number): cc.Tween<cc.Node> {
        return cc.tween(target.opacity).to(time, { opacity: 255 }, { easing: 'quadOut' })
    }


}
