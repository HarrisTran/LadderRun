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
    private cost: number = 5

    protected onEnable(): void {
        if(DEBUG_MODE) return;
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING,false) 
        if(DataManager.instance.isReplayed) {
            this.endGame();
            return;
        }
        DataManager.instance.isReplayed = true;

        this.node.getChildByName('style1').active = false;
        this.node.getChildByName('style2').active = true;
        let style = this.node.getChildByName('style2')
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
    }


    protected onDisable(): void {
        this.unschedule(this.endGame);
    }
}
