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

    protected onEnable(): void {
        if(DEBUG_MODE) return;
        if(DataManager.instance.isReplayed) {
            this.endGame();
            return;
        }
        DataManager.instance.isReplayed = true;

        this.node.getChildByName('style1').active = true;
        this.node.getChildByName('style2').active = false;
        // 动画
        let style = this.node.getChildByName('style1')
        if(DataManager.instance.type == ENUM_GAME_TYPE.LEVEL) style = this.node.getChildByName('style2')
        style.children.forEach(node=>{
            cc.tween(node).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
        })

        this.scheduleOnce(this.endGame,60);
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

    onReliveADClick(){

        /* dont need this*/

        // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        // SdkManager.instance.showVideoAd(()=>{
        //     ToastManager.instance.show('发放奖励，复活成功', {gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255)})
        //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false) 
        //     EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
        // })
    }

    onRestartClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.CONFIRM, true);
        
        //StaticInstance.uiManager.toggle(ENUM_UI_TYPE.CONFIRM, true) 
        // if(BackendConnector.instance.canRelive()){
        //     EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
        //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false)
        // }else{
        //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.CONFIRM, true);
        // }
        
    }

    onShareClick(){
        console.log("game over");
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
        //SdkManager.instance.activeShare()
    }

    protected onDisable(): void {
        this.unschedule(this.endGame);
    }
}
