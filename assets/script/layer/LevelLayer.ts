import { ENUM_GAME_EVENT } from './../Enum';
// Created by carolsail 

import { ENUM_AUDIO_CLIP, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import { levels } from "../Levels";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import EventManager from "../manager/EventManager";
import PoolManager from "../manager/PoolManager";
import { StaticInstance } from "../StaticInstance";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelLayer extends BaseLayer {

    @property(cc.Node)
    levelContent: cc.Node = null

    protected onEnable(): void {
        this.rendorLevelItem()
    }

    onCloseClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LEVEL, false)
    }

    onLevelItemClick(e: any, level: string){
        const l: number = parseInt(level)
        if(l <= DataManager.instance.unlock){
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
            DataManager.instance.type = ENUM_GAME_TYPE.LEVEL
            DataManager.instance.level = l
            DataManager.instance.save()
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, false)
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LEVEL, false)
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.GAME)
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_START)
        }
    }

    rendorLevelItem(){
        if(!this.levelContent) return
        this.levelContent.removeAllChildren()
        for(let i = 0; i < levels.length; i++){
            const levelItem: cc.Node = PoolManager.instance.getNode('levelItem', this.levelContent)
            const level = i + 1
            levelItem.getChildByName('label').getComponent(cc.Label).string = `${level}`
            // 缩放动画
            cc.tween(levelItem).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
            const button = levelItem.getComponent(cc.Button)
            if(level > DataManager.instance.unlock){
                levelItem.getChildByName('lock').active = true
                button.enabled = false
            }else{
                levelItem.getChildByName('lock').active = false
                // button添加事件
                const event = new cc.Component.EventHandler()
                event.target = this.node
                event.component = 'LevelLayer'
                event.handler = 'onLevelItemClick'
                event.customEventData = `${level}`
                button.clickEvents.push(event)
            }
        }
    }
}
