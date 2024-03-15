// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import BackendConnector from "../BackendConnector";
import EventManager from "../manager/EventManager";
import { DEBUG_MODE } from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseLayer extends BaseLayer {

    @property(cc.Label)
    currentNumberExtra : cc.Label = null;

    @property(cc.Node)
    showScorePanel : cc.Node = null;

    @property(cc.Label)
    topText: cc.Label = null;

    @property(cc.Label)
    lastScoreText: cc.Label = null;

    @property(cc.Label)
    currentScoreText: cc.Label = null;

    @property(cc.Node)
    retryPanel : cc.Node = null;

    @property(cc.Label)
    retryWarning: cc.Label = null;

    @property(cc.Button)
    retryBtn: cc.Button = null;

    @property(cc.Node)
    buyMorePanel : cc.Node = null;

    private _isLackTicket :  boolean = false;

    protected onEnable(): void {
        if(DEBUG_MODE) return;
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING,false)
        if(DataManager.instance.isReplayed) {
            this.endGame();
            return;
        }
        DataManager.instance.isReplayed = true;
        this.initializeUI();
        // 动画
        // let style = this.node.getChildByName('style2')
        // //if(DataManager.instance.type == ENUM_GAME_TYPE.LEVEL) style = this.node.getChildByName('style2')
        // style.children.forEach(node=>{
        //     cc.tween(node).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
        // })
        this.scheduleOnce(this.endGame,60);
    }

    private initializeUI(){
        this.topText.string = BackendConnector.instance.maxScore.toString();
        this.lastScoreText.string = BackendConnector.instance.currentScore.toString();
        this.currentScoreText.string = DataManager.instance.score.toString();
    }

    private endGame(){
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
    }

    onReliveClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        
        BackendConnector.instance.postScoreToServer(DataManager.instance.score)
        // if(DataManager.instance.coins >= this.cost){
        //     DataManager.instance.coins -= this.cost
        //     DataManager.instance.save()
        //     ToastManager.instance.show('Reborn Succeed', {gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255)})  // Translated
        //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false) 
        //     EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
        // }else{
        //     ToastManager.instance.show('Reborn Failed', {gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255)})  // Translated
        // }
    }

    onContinueButton()
    {
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        if(DEBUG_MODE){
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            return;
        }
        this.currentNumberExtra.string = BackendConnector.instance.numberTicket.toString();
        this.retryWarning.string = `Used ${BackendConnector.instance.getTicketCanBeMinus()} extra to replay!`
        this.showScorePanel.active = false;
    }

    onDeductedButton()
    {
        // let button = this.deductedButton.getComponent(cc.Button);
        this.retryBtn.interactable = false;
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        if(DEBUG_MODE){
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            return;
        }
        // if(this._isLackTicket){
        //     BackendConnector.instance.postMessage();
        // }else{
        //     if (BackendConnector.instance.canRelive()) {
        //         BackendConnector.instance.checkGameScoreTicket()
        //             .then(() => {
        //                 EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
        //             })
        //             .catch(() => {
        //                 EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
        //             })
        //     } else {
        //         this.retryBtn.interactable = true;
        //         this._isLackTicket = true;
        //         this.retryPanel.active = false;
        //     }
        // }

        if (BackendConnector.instance.canRelive()) {
            BackendConnector.instance.checkGameScoreTicket()
                .then(() => {
                    EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
                })
                .catch(() => {
                    EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
                })
        } else {
            this.retryBtn.interactable = true;
            this._isLackTicket = true;
            this.retryPanel.active = false;
        }
    }

    onBuyMoreButton(){
        BackendConnector.instance.postMessage();
    }

    onCancelButton(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        this.hide();
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER);
    }


    onQuit(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
        //SdkManager.instance.activeShare()
    }

    protected onDisable(): void {
        this.unschedule(this.endGame);
    }
}
