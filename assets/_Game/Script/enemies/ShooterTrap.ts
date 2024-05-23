// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_SHOOTER_STATUS, GameState } from "../Enum";
import GameManager from "../manager/GameManager";
import PoolManager from "../manager/PoolManager";
import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShooterTrap extends cc.Component {
    @property(cc.Node) bulletNode : cc.Node = null;

    _status: ENUM_SHOOTER_STATUS = ENUM_SHOOTER_STATUS.IDLE
    //animation: cc.Animation = null
    isShoot: boolean = false
    shootTime: number = 1.3
    bulletpos: cc.Node = null
    dir: number = 0;
 
    attackSoundId: number = 0;
 
    get status(){
        return this._status
    }
 
    set status(data: ENUM_SHOOTER_STATUS){
        this._status = data
        this.onAnimPlay()
    }
 
    protected onLoad(): void {
        //this.animation = this.node.getChildByName('body').getComponent(cc.Animation)
        //this.animation.on('finished', this.onFinished, this);
    }

    protected start(): void {
        this.dir = this.node.x > 0 ? -1 : 1;
        this.node.scaleX = this.dir
    }
 
    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW && !this.isShoot){
            // 开启发射子弹
            this.isShoot = true
            this.onBulletBuild()
            this.schedule(this.onBulletBuild, this.shootTime)
        }
    }
 
    onCollisionExit (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            this.isShoot = false;
            this.unschedule(this.onBulletBuild);
            // AudioManager.instance.stopSound(this.attackSoundId);
        }
    }
 
    onBulletBuild(){
        if(GameManager.Instance.CurrentGameState != GameState.PLAYING) return
        this.status = ENUM_SHOOTER_STATUS.ATTACK
        GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_SHOT);
        // AudioManager.instance.playSound(ENUM_AUDIO_CLIP.PLANT_SHOOT).then(v=>this.attackSoundId=v);
        const bullet = PoolManager.instance.getNode('bullet', this.bulletNode)
    }
 
    onFinished(){
        this.status = ENUM_SHOOTER_STATUS.IDLE
    }
 
    setDir(dir: number){
        this.node.scaleX = dir
    }
 
    onAnimPlay(){
        //this.animation.play(this.status)
    }
 
    protected onDestroy(): void {
        this.unscheduleAllCallbacks()
        //this.animation.off('finished', this.onFinished, this)
    }
}
