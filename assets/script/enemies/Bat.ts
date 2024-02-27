// Created by carolsail

import AudioManager from '../manager/AudioManager';
import DataManager from '../manager/DataManager';
import { ENUM_COLLIDER_TAG, ENUM_BAT_STATUS, ENUM_GAME_STATUS, ENUM_AUDIO_CLIP } from './../Enum';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bat extends cc.Component {

    _status: ENUM_BAT_STATUS = ENUM_BAT_STATUS.IDLE
    anim: cc.Animation = null
    dir: number = 0
    speed: number = 100

    get status(){
        return this._status
    }

    set status(data: ENUM_BAT_STATUS){
        this._status = data
        this.onAnimPlay()
    }

    protected onLoad(): void {
        this.anim = this.node.getChildByName('body').getComponent(cc.Animation)
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.BAT_VIEW && this.status == ENUM_BAT_STATUS.IDLE){
            this.status = ENUM_BAT_STATUS.WALL_OUT
            //AudioManager.instance.playSound(ENUM_AUDIO_CLIP.BAT_FLY)
            // 速度随机性
            this.speed += Math.random() * 80
            // 坠落
            let y = -100
            if(Math.random() > 0.5) y = -200
            const act = cc.moveBy(0.5, cc.v2(0, y)).easing(cc.easeCubicActionOut())
            cc.tween(this.node).then(act).call(()=>{
                // 飞行
                this.status = ENUM_BAT_STATUS.FLY
                this.dir = this.node.x < 0 ? 1 : -1
                //this.node.scaleX *= -this.dir
            }).start()
        }
    }

    onAnimPlay(){
        this.anim.play(this.status)
    }

    protected update(dt: number): void {
        if(DataManager.instance.status != ENUM_GAME_STATUS.RUNING) return
        if(this.dir){
            this.node.x += this.speed * this.dir * dt
            if(Math.abs(this.node.x) >= 400) this.node.removeFromParent()
        }
    }
}
