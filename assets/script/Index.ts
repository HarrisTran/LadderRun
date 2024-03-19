// Created by carolsail

import { StaticInstance } from './StaticInstance';
import { ENUM_RESOURCE_TYPE, ENUM_UI_TYPE } from './Enum';
import AudioManager from "./manager/AudioManager";
import DataManager from './manager/DataManager';
import ResourceManager from "./manager/ResourceManager";
import SdkManager from './manager/SdkManager';
import BackendConnector from './BackendConnector';
import { DEBUG_MODE } from './manager/GameManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Index extends cc.Component {

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;


    protected onLoad() {
        cc.resources.preloadDir("/", (current: number, total: number)=>{
            this.progressBar.progress = cc.misc.lerp(0,1,current / 380);
        }, async ()=>{
            // Collision Manager
            const collisionManager = cc.director.getCollisionManager()
            collisionManager.enabled = true
            // Load Resource
            await ResourceManager.instance.loadRes(ENUM_RESOURCE_TYPE.AUDIO)
            await ResourceManager.instance.loadRes(ENUM_RESOURCE_TYPE.PREFAB)
            await ResourceManager.instance.loadRes(ENUM_RESOURCE_TYPE.SPRITE)
            // Read Data
            DataManager.instance.restore()
            // Play Music
            AudioManager.instance.playMusic()
            // Load SDK
            // SdkManager.instance.passiveShare()
            // SdkManager.instance.getRank()
            // SdkManager.instance.initBannerAd()
            // SdkManager.instance.initInterstitialAd()
            // SdkManager.instance.initVideoAd()
            // Show UI
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOADING, false)
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.MENU, true)
            // Get key from backend
            
            if(!DEBUG_MODE) BackendConnector.instance.authenticate();
        })
    }
}
