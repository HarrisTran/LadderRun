// Created by carolsail 

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import AlertManager from "../manager/AlertManager";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import ToastManager from "../manager/ToastManager";
import { StaticInstance } from "../StaticInstance";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinLayer extends BaseLayer {

    @property(cc.Label)
    coinsLabel: cc.Label = null
    @property(cc.Node)
    contentNode: cc.Node = null

    onEnable(){
        this.rendorCoins()
        this.rendorItems()
    }

    rendorCoins(){
        if(!this.coinsLabel) return
        this.coinsLabel.string = `${DataManager.instance.coins}`
    }

    rendorItems(scaleEffect: boolean = true){
        if(!this.contentNode) return
        this.contentNode.children.forEach((item, index)=>{
            // 缩放动画
            if(scaleEffect) cc.tween(item).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
            const info = DataManager.instance.skinLockInfo[index]
            const locked = info['locked']
            const checkmark = item.getChildByName('checkmark')
            const lock = item.getChildByName('lock')
            const coins = lock.getChildByName('num').getComponent(cc.Label)
            checkmark.active = index == DataManager.instance.skinIndex
            lock.active = locked
            coins.string = `${info['coins']}`
            // 注册事件
            const button = item.getComponent(cc.Button)
            button.clickEvents = []
            const event = new cc.Component.EventHandler()
            event.target = this.node
            event.component = 'SkinLayer'
            event.handler = 'onItemClick'
            event.customEventData = `${index}`
            button.clickEvents.push(event)
        })
    }
    
    onCloseClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.SKIN, false)
    }

    onItemClick(e: any, index: number){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        if(!DataManager.instance.skinLockInfo[index]['locked']){
            if(index == DataManager.instance.skinIndex) return
            DataManager.instance.skinIndex = index
            DataManager.instance.save()
            this.rendorItems(false)
        }else{
            AlertManager.instance.show('Xác nhận mở khóa？', ()=>{ // Translated
                const info = DataManager.instance.skinLockInfo[index]
                if(DataManager.instance.coins >= info['coins']){
                    DataManager.instance.coins -= info['coins']
                    DataManager.instance.save()
                    DataManager.instance.setSkinLockInfo(index, false)
                    this.rendorCoins()
                    this.rendorItems(false)
                }else{
                    ToastManager.instance.show('Tiền không đủ', {gravity: 'BOTTOM', bg_color: cc.color(226, 69, 109, 255)})
                }
            })
        }
    }
}
