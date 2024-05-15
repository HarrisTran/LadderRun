// Created by carolsail

import { ENUM_AUDIO_CLIP } from './../Enum';
import DataManager from './DataManager';
import ResourceManager from "./ResourceManager"

export default class AudioManager {
    private audioSource: cc.AudioSource = null
    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
            this._instance.init()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<AudioManager>()
    }

    init(){
        this.audioSource = new cc.AudioSource()
        this.audioSource.loop = true
        this.audioSource.volume = 0.3
    }

    async playMusic(){
        const clip = await ResourceManager.instance.getClip(ENUM_AUDIO_CLIP.BGM)
        this.audioSource.clip = clip
        cc.audioEngine.playMusic(clip,true);
    }

    stopMusic(){
        cc.audioEngine.stopMusic();
    }

    async playSound(name: ENUM_AUDIO_CLIP, isLoop: boolean = false){
        if(!DataManager.instance.isSoundOn) return
        const clip = await ResourceManager.instance.getClip(name)
        return cc.audioEngine.playEffect(clip, isLoop)
    }

    stopAllEffect(){
        cc.audioEngine.stopAllEffects();
    }

    resumeAllEffect(){
        cc.audioEngine.resumeAllEffects();
    }

    stopSound(audioId: number){
        cc.audioEngine.stopEffect(audioId)
    }
}