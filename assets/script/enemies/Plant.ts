// Created by carolsail

import { ENUM_PLANT_STATUS, ENUM_COLLIDER_TAG, ENUM_GAME_STATUS } from "../Enum";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";
import Plantbullet from "./Plantbullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Plant extends cc.Component {

    _status: ENUM_PLANT_STATUS = ENUM_PLANT_STATUS.IDLE
    animation: cc.Animation = null
    isShoot: boolean = false
    shootTime: number = 1
    bulletpos: cc.Node = null

    get status(){
        return this._status
    }

    set status(data: ENUM_PLANT_STATUS){
        this._status = data
        this.onAnimPlay()
    }

    protected onLoad(): void {
        this.animation = this.node.getChildByName('body').getComponent(cc.Animation)
        this.bulletpos = this.node.getChildByName('bulletpos')
        this.animation.on('finished', this.onFinished, this);
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.PLANT_VIEW && !this.isShoot){
            // 开启发射子弹
            this.isShoot = true
            this.onBulletBuild()
            this.schedule(this.onBulletBuild, this.shootTime)
        }
    }

    onBulletBuild(){
        if(DataManager.instance.status != ENUM_GAME_STATUS.RUNING) return
        this.status = ENUM_PLANT_STATUS.ATTACK
        const bullet = PoolManager.instance.getNode('plantbullet', this.bulletpos)
        const dir = this.node.scaleX == 1 ? -this.node.scaleX : this.node.scaleX 
        bullet.getComponent(Plantbullet).setDir(dir)
    }

    onFinished(){
        this.status = ENUM_PLANT_STATUS.IDLE
    }

    setDir(dir: number){
        this.node.scaleX = dir
    }

    onAnimPlay(){
        this.animation.play(this.status)
    }

    protected onDestroy(): void {
        this.unscheduleAllCallbacks()
        this.animation.off('finished', this.onFinished, this)
    }
}
