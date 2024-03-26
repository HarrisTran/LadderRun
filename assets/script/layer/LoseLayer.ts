// Created by carolsail

import { COIN_VALUE, ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import BackendConnector from "../BackendConnector";
import EventManager from "../manager/EventManager";
import { DEBUG_MODE } from "../manager/GameManager";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseLayer extends BaseLayer {

    // @property(cc.Label)
    // currentNumberExtra : cc.Label = null;

    // @property(cc.Node)
    // showScorePanel : cc.Node = null;

    // @property(cc.Label)
    // topText: cc.Label = null;

    // @property(cc.Label)
    // lastScoreText: cc.Label = null;

    // @property(cc.Label)
    // currentScoreText: cc.Label = null;

    // @property(cc.Node)
    // retryPanel : cc.Node = null;

    // @property(cc.Label)
    // retryWarning: cc.Label = null;

    // @property(cc.Button)
    // retryBtn: cc.Button = null;

    // @property(cc.Node)
    // buyMorePanel : cc.Node = null;

    // new properties

    @property(cc.Node)
    coinFlyContainer: cc.Node = null;

    @property(cc.Label)
    popScoreLabel : cc.Label = null;

    @property(cc.Label)
    receivedScoreLabel : cc.Label = null;

    @property(cc.Label)
    topScoreLabel: cc.Label = null;

    @property(cc.Label)
    ticketCanMinus: cc.Label = null;

    @property(cc.Animation)
    animation1: cc.Animation = null;

    @property(cc.Animation)
    animation2: cc.Animation = null;

    @property(cc.Animation)
    animation3: cc.Animation = null;

    @property(cc.Sprite)
    ticketButton : cc.Sprite = null;

    @property(cc.Button)
    bgshadeButton : cc.Button = null;

    @property(cc.SpriteFrame)
    redButton: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    yellowButton: cc.SpriteFrame = null;

    @property(cc.Prefab)
    coinFlyPrefab : cc.Prefab = null;

    private _sendScore : number = 0;
    private _totalScore : number = 0;

    protected onLoad(): void {
        this.animation3.on('finished',this.onFinished,this);
    }

    private onFinished()
    {
        this.ticketButton.getComponent(cc.Button).interactable = !DataManager.instance.isReplayed
        if(DataManager.instance.isReplayed) {
            this.onQuit();
        }
        DataManager.instance.isReplayed = true;
    }

    protected onEnable(): void {
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING,false)
        
        this.initializeUI();
        this.initializeAnimation();
        
        this.scheduleOnce(this.onQuit,60);
    }

    private initializeUI(){
        let ticket : number = BackendConnector.instance.getTicketCanBeMinus();
        this.topScoreLabel.string = BackendConnector.instance.maxScore.toString();
        this.popScoreLabel.string = DataManager.instance.score.toString();
        this.receivedScoreLabel.string = BackendConnector.instance.currentScore.toString();
        this.ticketCanMinus.string = `-${ticket}`
        this.ticketButton.spriteFrame = BackendConnector.instance.canRelive() ? this.yellowButton : this.redButton
    } 

    
    private async initializeAnimation()
    {
        await delay(200);
        this._sendScore =  DataManager.instance.score;
        this._totalScore = this._sendScore + BackendConnector.instance.currentScore;

        let coinNo = Math.round(this._sendScore/50);
        let delayTimer : number = 100;
        this.coinFlyContainer.removeAllChildren();
        for(let i = 0; i < coinNo; i++) {
            let node = cc.instantiate(this.coinFlyPrefab);
            node.parent = this.coinFlyContainer;
        }
        for (let index = 0; index < this.coinFlyContainer.children.length; index++) {
            let element = this.coinFlyContainer.children[index];
            let animation = element.getComponent(cc.Animation)
            animation.play("COIN_FLY")
            this._sendScore -= COIN_VALUE;
            this.popScoreLabel.string = this._sendScore.toString();
            await delay(delayTimer);
            this.animation2.play("NUM_RECEIVE")
            this.receivedScoreLabel.string = (this._totalScore-this._sendScore).toString();
        }
        DataManager.instance.isReplayed ? this.animation3.play("NUM_RESULT_END") : this.animation3.play("NUM_RESULT")
        this.coinFlyContainer.removeAllChildren();
    }

    private onClickTicketButton()
    {
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        if(BackendConnector.instance.canRelive())
        {
            BackendConnector.instance.checkGameScoreTicket()
            .then(() => {
                this.ticketButton.node.active = false;
                EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            })
            .catch(() => {
                EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            })
        }
        else{
            BackendConnector.instance.postMessage();
        }
    }

    onContinueButton()
    {
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        if(DEBUG_MODE){
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            return;
        }
    }

    onQuit(){
        this.bgshadeButton.interactable = false;
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
    } 

    protected onDisable(): void {
        this.unschedule(this.onQuit);
    }
}
