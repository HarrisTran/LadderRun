// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_CHICKEN_STATUS, ENUM_COLLIDER_TAG, ENUM_GAME_STATUS } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Chicken extends cc.Component {

    _status: ENUM_CHICKEN_STATUS = ENUM_CHICKEN_STATUS.IDLE
    anim: cc.Animation = null
    dir: number = 0
    speed: number = 300

    runSoundId: number = 0;

    get status(){
        return this._status
    }

    set status(data: ENUM_CHICKEN_STATUS){
        this._status = data
        this.onAnimPlay()
    }

    protected onLoad(): void {
        this.anim = this.node.getChildByName('body').getComponent(cc.Animation)
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.CHICKEN_VIEW){
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CHICKEN_RUN,true).then((v)=>this.runSoundId=v);
        }
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.CHICKEN_VIEW && this.status == ENUM_CHICKEN_STATUS.IDLE){
            this.status = ENUM_CHICKEN_STATUS.RUN
            this.speed += Math.random() * 80
            this.dir = 1
            this.node.scaleX = this.dir * -1
        }else if((other.tag == ENUM_COLLIDER_TAG.WALL || other.tag == ENUM_COLLIDER_TAG.BRICK) && self.tag == ENUM_COLLIDER_TAG.CHICKEN && this.status == ENUM_CHICKEN_STATUS.RUN){
            this.onTurn()
        }
    }

    onCollisionExit (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.CHICKEN_VIEW){
            AudioManager.instance.stopSound(this.runSoundId);
        }
    }

    
    getDir(){
        return this.dir
    }

    onTurn(){
        if(this.dir){
            this.dir *= -1
            this.node.scaleX = this.dir * -1
        }
    }

    onAnimPlay(){
        this.anim.play(this.status)
    }

    update (dt: number) {
        if(DataManager.instance.status != ENUM_GAME_STATUS.RUNING) return
        if(this.dir){
            this.node.x += this.speed * this.dir * dt
        }
    }
}
