// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import EventManager from "../manager/EventManager";
import SdkManager from "../manager/SdkManager";
import DataManager from "../manager/DataManager";
import ToastManager from "../manager/ToastManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseLayer extends BaseLayer {

    @property(cc.Label)
    costNumLabel: cc.Label = null
    cost: number = 5

    protected onEnable(): void {
        this.node.getChildByName('style1').active = DataManager.instance.type == ENUM_GAME_TYPE.LOOP
        this.node.getChildByName('style2').active = DataManager.instance.type == ENUM_GAME_TYPE.LEVEL
        this.costNumLabel.string = `${this.cost}`
        // 动画
        let style = this.node.getChildByName('style1')
        if(DataManager.instance.type == ENUM_GAME_TYPE.LEVEL) style = this.node.getChildByName('style2')
        style.children.forEach(node=>{
            cc.tween(node).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
        })
    }

    onReliveClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        if(DataManager.instance.coins >= this.cost){
            DataManager.instance.coins -= this.cost
            DataManager.instance.save()
            ToastManager.instance.show('金币扣除，复活成功', {gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255)})
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false) 
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
        }else{
            ToastManager.instance.show('金币不足，复活失败', {gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255)})
        }
    }

    onReliveADClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.showVideoAd(()=>{
            ToastManager.instance.show('发放奖励，复活成功', {gravity: 'BOTTOM', bg_color: cc.color(102, 202, 28, 255)})
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false) 
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
        })
    }

    onRestartClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false)
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_START)
    }

    onShareClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        SdkManager.instance.activeShare()
    }
}
