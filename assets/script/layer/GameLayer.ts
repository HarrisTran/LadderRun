import BackendConnector from "../BackendConnector";
import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_STATUS, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import EventManager from "../manager/EventManager";
import PoolManager from "../manager/PoolManager";
import NumberAnimation from "../NumberAnimation";
import { StaticInstance } from "../StaticInstance";
import { Vec2ToVec3, Vec3ToVec2 } from "../Utils";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLayer extends BaseLayer {

    @property(cc.Label)
    goalLabel: cc.Label = null
    @property(NumberAnimation)
    coinsLabel: NumberAnimation = null
    @property(cc.Node)
    historyNode: cc.Node = null

    @property(cc.Node)
    pickupTarget: cc.Node = null;


    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.historyNode.active = DataManager.instance.type == ENUM_GAME_TYPE.LOOP
    }

    onTouchStart(e: cc.Event.EventTouch){
        EventManager.instance.emit(ENUM_GAME_EVENT.PLAYER_JUMP)
    }

    onSettingClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.setSettingStyle(1)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING)
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
    }

    setGoal(){
        if(!this.goalLabel) return
        this.goalLabel.string = `${DataManager.instance.goal} floor`
    }

    setScore(){
        this.coinsLabel.string = `${DataManager.instance.score}`
    }

    setMaxScore()
    {
        if(!this.historyNode) return
        const maxScore = this.historyNode.getChildByName('maxScore')
        maxScore.getComponent(cc.Label).string = BackendConnector.instance.maxScore.toString();
    }

    setMaxGoal(){
        if(!this.historyNode) return
        const maxGoal = this.historyNode.getChildByName('maxGoal')
        maxGoal.getComponent(cc.Label).string = `${DataManager.instance.maxGoal}`
    }

    // async playCoinCountingDown(){
    //     let tempScore : number = DataManager.instance.score;
    //     while (tempScore>0) {
    //         await this.coinsLabel.playDiscreteResize(tempScore)
    //         tempScore -= 50;
    //     }
    // }

    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    }

    public spawnCoinAtPosition(position: cc.Vec3){ // world to local
        const pos = position.add(new cc.Vec3(0, -200, 0))
        const coin = PoolManager.instance.getNode('coin', this.node, pos);
        cc.tween(coin)
        .to(1,{position: this.pickupTarget.position},{easing: "sineOut"})
        .start();
    }
}
