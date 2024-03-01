// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import SdkManager from "../manager/SdkManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingLayer extends BaseLayer {

    @property(cc.Node)
    styleNode: cc.Node = null
    musicNode: cc.Node = null
    soundNode: cc.Node = null

    protected onEnable(): void {
        //SdkManager.instance.showInterstitialAd()
        this.rendorMusic()
        this.rendorSound()
    }

    onCloseClick(e: any){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING, false)
        // 区分在哪个场景中调用的
        if(StaticInstance.uiManager.isActive(ENUM_UI_TYPE.GAME)) {
            DataManager.instance.status = ENUM_GAME_STATUS.RUNING
        }
    }

    onHomeClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.GAME, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SETTING, false)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, true)
    }

    onSoundClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.isSoundOn = !DataManager.instance.isSoundOn
        if(DataManager.instance.isSoundOn){
            AudioManager.instance.resumeAllEffect()
        }else{
            AudioManager.instance.stopAllEffect()
        }
        DataManager.instance.save()
        this.rendorSound()
    }

    onMusicClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        DataManager.instance.isMusicOn = !DataManager.instance.isMusicOn
        DataManager.instance.save()
        if(DataManager.instance.isMusicOn){
            AudioManager.instance.playMusic()
        }else{
            AudioManager.instance.stopMusic()
        }
        this.rendorMusic()
    }

    setStyle(i: number){
        this.styleNode.children.forEach((style, index)=>{
            style.active = i === index
        })
        const style: cc.Node = this.styleNode.children[i]
        const buttons: cc.Node = style.getChildByName('buttons')
        this.musicNode = buttons.getChildByName('music')
        this.soundNode = buttons.getChildByName('sound')
        // 动画
        style.children.forEach(node=>{
            cc.tween(node).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
        })
    }

    rendorMusic(){
        if(!this.musicNode) return
        this.musicNode.getChildByName('on').active = DataManager.instance.isMusicOn
        this.musicNode.getChildByName('off').active = !DataManager.instance.isMusicOn
    }
    
    rendorSound(){
        if(!this.soundNode) return
        this.soundNode.getChildByName('on').active = DataManager.instance.isSoundOn
        this.soundNode.getChildByName('off').active = !DataManager.instance.isSoundOn
    }
}
