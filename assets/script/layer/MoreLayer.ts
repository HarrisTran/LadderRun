// Created by carolsail 

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";
import ResourceManager from "../manager/ResourceManager";
import SdkManager from "../manager/SdkManager";
import { StaticInstance } from "../StaticInstance";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoreLayer extends BaseLayer {

    @property(cc.Node)
    contentNode: cc.Node = null

    onEnable(){
        this.rendorItems()
    }

    rendorItems(){
        if(!this.contentNode) return
        this.contentNode.removeAllChildren()
        DataManager.instance.games.forEach(async data=>{
            const moreitem = PoolManager.instance.getNode('moreitem', this.contentNode)
            cc.tween(moreitem).to(0.15, {scale: 0.8}).to(0.15, {scale: 1}).start()
            const icon = await ResourceManager.instance.getSprite(data['icon'])
            moreitem.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = icon
            moreitem.getChildByName('title').getComponent(cc.Label).string = `${data.title}`
            const url = typeof window['wx'] === 'undefined' ? `${data.url}` : `${data.appid}`
            moreitem.on('click', ()=>{
                AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
                //if(url) SdkManager.instance.turnToApp(url)
            })
        })
    }
    
    onCloseClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK)
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MORE, false)
    }
}
