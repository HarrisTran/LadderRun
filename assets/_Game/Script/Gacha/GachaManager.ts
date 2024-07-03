import { ENUM_GAME_EVENT } from "../Enum";
import GameManager from "../manager/GameManager";
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

    hide(){
        this.animateHide();
        this._requestReward();
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
        },0.1)
    }

    protected async animateHide() {
        this.onHideStart();
        this.TweenHideScalePopup(this.panelContent, 0.5).start();
        this.TweenHideAlphaBG(this.background, 0.5).start();
        this.scheduleOnce(()=>{
            this.onHideEnd();
            this.node.active = false;
        },0.1)
    }    

    private _requestReward() {
        switch (this._reward.id) {
            case 'GMN':
                cc.game.emit(ENUM_GAME_EVENT.CLAIM_MAGNET_BOOSTER);
                break;
            case 'GSH':
                cc.game.emit(ENUM_GAME_EVENT.CLAIM_SHIELD_BOOSTER);
                break;
            case 'GSP':
                cc.game.emit(ENUM_GAME_EVENT.CLAIM_SPEED_BOOSTER);
                break;
            case 'GC100':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,100);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
            case 'GC150':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,150);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
            case 'GC200':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,200);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
            case 'GC250':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,250);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
            case 'GC300':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,300);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
            case 'GC350':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,350);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
            case 'GC400':
                cc.game.emit(ENUM_GAME_EVENT.UPDATE_SCORE,400);
                GameManager.Instance.UIManager.gameLayer.pickUpCoin(cc.v3(0));
                break;
        }
    }

    onShowStart(){
        cc.game.emit(ENUM_GAME_EVENT.UPDATE_GAME_TICK,0)
    }

    onShowEnd(){
        let gacha = this.gachas.find((gacha)=>gacha.type === this._showingGachaType)
        gacha.gacha.active = true;
    }

    onHideStart(){
        let gacha = this.gachas.find((gacha)=>gacha.type === this._showingGachaType)
        gacha.gacha.active = false;
    }

    onHideEnd(){
        cc.game.emit(ENUM_GAME_EVENT.UPDATE_GAME_TICK,1)
    }

    protected TweenShowScalePopUp(target: cc.Node, time: number, scale: number): cc.Tween<cc.Node> {
        return cc.tween(target).to(time, { scale: scale }, { easing: 'backOut' })
    }

    protected TweenShowAlphaBG(target: cc.Node, time: number): cc.Tween<cc.Node> {
        return cc.tween(target.opacity).to(time, { opacity: 255 }, { easing: 'quadOut' })
    }

    protected TweenHideScalePopup(target: cc.Node, time: number): cc.Tween<cc.Node> {
        return cc.tween(target).to(time, { scale: 0 }, { easing: 'backOut' })
    }

    protected TweenHideAlphaBG(target: cc.Node, time: number): cc.Tween<cc.Node> {
        return cc.tween(target.opacity).to(time, { opacity: 0 }, { easing: 'quadOut' })
    }


}
