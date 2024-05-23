// Created by carolsail

import { ENUM_AUDIO_CLIP, SCENE_TO_RESOURCES_MAPPING } from './../Enum';
import DataManager from './DataManager';
import { IManager } from './IManager';
import ResourceManager from "./ResourceManager"
const { ccclass, property } = cc._decorator;
@ccclass
export default class AudioManager extends cc.Component implements IManager{
    private static readonly AUDIO_PATH = 'audio';
    
    @property(cc.AudioSource)
    private soundSource: cc.AudioSource = null;

    @property(cc.AudioSource)
    private musicSource: cc.AudioSource = null;

    @property(cc.Sprite)
    soundButton: cc.Sprite = null;

    @property(cc.SpriteFrame)
    soundOn: cc.SpriteFrame = null;
    
    @property(cc.SpriteFrame)
    soundOff: cc.SpriteFrame = null;

    private _audioClipSet: {[key:string]: cc.AudioClip} = {};
    private _audioInitializeProgress: number;
    private _isAudioInitializeDone: boolean;
    private _isMute = false;

    initialize() {
        this._audioInitializeProgress = 0;
        this._isAudioInitializeDone = false;
        cc.assetManager.loadBundle(SCENE_TO_RESOURCES_MAPPING[cc.director.getScene().name],(error,bundle)=>{
            bundle.loadDir(AudioManager.AUDIO_PATH,cc.AudioClip,
                (finish,total,item)=>{
                    this._audioInitializeProgress = finish / total;
                },
                (error,assets)=>{
                    if (error) console.error(error);
                    let asset: any;
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        this._audioClipSet[asset.name] = asset;
                    }
                    this._audioInitializeProgress = 1;
                    this._isAudioInitializeDone = true;
                }
            )
        })

    }
    progress(): number {
        return this._audioInitializeProgress;
    }
    initializationCompleted(): boolean {
        return this._isAudioInitializeDone;
    }

    public toggleMute(): boolean {
        this._isMute = !this._isMute;
        this.soundButton.spriteFrame = this._isMute ? this.soundOff : this.soundOn;
        this.setMute(this._isMute);
        return this._isMute;
    }

    public setMute(mute: boolean) {
        this._isMute = mute;
        if(this.soundSource.clip){
            this.soundSource.volume = mute ? 0 : 1;
        }
        if(this.musicSource.clip){
            this.musicSource.volume = mute ? 0 : 1;
        }
    }

    public playBGM(volume = 1, loop = true) {
        this.musicSource.stop();
        this.musicSource.clip = this._audioClipSet[ENUM_AUDIO_CLIP.BGM];
        this.musicSource.play();
    }

    public playSfx(audioClipName: ENUM_AUDIO_CLIP, volume = 1, loop = false) {
        
        this.soundSource.clip = this._audioClipSet[audioClipName];
        this.soundSource.volume = volume;
        this.soundSource.loop = loop;
        if(loop) return;
        this.soundSource.play();
    }

    // init(){
    //     this.audioSource = new cc.AudioSource()
    //     this.audioSource.loop = true
    //     this.audioSource.volume = 0.3
    // }

    // async playMusic(){
    //     const clip = await ResourceManager.instance.getClip(ENUM_AUDIO_CLIP.BGM)
    //     this.audioSource.clip = clip
    //     cc.audioEngine.playMusic(clip,true);
    // }

    // stopMusic(){
    //     cc.audioEngine.stopMusic();
    // }

    // async playSound(name: ENUM_AUDIO_CLIP, isLoop: boolean = false){
    //     if(!DataManager.instance.isSoundOn) return
    //     const clip = await ResourceManager.instance.getClip(name)
    //     return cc.audioEngine.playEffect(clip, isLoop)
    // }

    // stopAllEffect(){
    //     cc.audioEngine.stopAllEffects();
    // }

    // resumeAllEffect(){
    //     cc.audioEngine.resumeAllEffects();
    // }

    // stopSound(audioId: number){
    //     cc.audioEngine.stopEffect(audioId)
    // }
}
