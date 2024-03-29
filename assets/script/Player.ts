import { ENUM_COLLIDER_TAG, ENUM_PLAYER_STATUS, ENUM_GAME_EVENT, ENUM_AUDIO_CLIP, ENUM_GAME_STATUS, ENUM_UI_TYPE} from "./Enum";
import AudioManager from "./manager/AudioManager";
import DataManager from "./manager/DataManager";
import EventManager from "./manager/EventManager";
import Chicken from './enemies/Chicken';

const {ccclass, property} = cc._decorator;

let v3 = new cc.Vec3()

@ccclass
export default class Player extends cc.Component {
    // 画布
    canvas: cc.Node = null
    // 速度
    speed: cc.Vec2 = cc.v2(0, 0)
    // 行走
    walk: number = 200
    // 移动方向
    direction: number = 0
    // 跳跃
    jump: number = 700
    // 跳跃累计数
    jumpCount:number = 0
    // 跳跃限制数
    jumpLimit: number = 1
    // 重力
    gravity: number = -2000
    // 状态
    _status: ENUM_PLAYER_STATUS = ENUM_PLAYER_STATUS.JUMP
    // 动画
    anim: cc.Animation = null
    _enablePowerUp: boolean = false;

    get status(){
        return this._status
    }

    set status(data: ENUM_PLAYER_STATUS){
        this._status = data
        this.onAnimPlay()
    }

    // 是否在空中
    isAir(){
        return this.status == ENUM_PLAYER_STATUS.JUMP
    }
    
    // 是否在攀爬
    isClimb(){
        return this.status == ENUM_PLAYER_STATUS.CLIMB
    }

    protected onLoad(): void {
        this.canvas = cc.find('Canvas')
        this.anim = this.node.getChildByName('body').getComponent(cc.Animation)
        EventManager.instance.on(ENUM_GAME_EVENT.PLAYER_JUMP, this.onJump, this)
    }

    protected onDestroy(): void {
        EventManager.instance.off(ENUM_GAME_EVENT.PLAYER_JUMP, this.onJump)
    }

    update (dt: number) {
        if(this.isAir()) this.speed.y += this.gravity * dt
        if(!this.isClimb()) this.speed.x = this.walk * this.direction
        if(DataManager.instance.status == ENUM_GAME_STATUS.RUNING) {
            this.node.x += this.speed.x * dt
        }
        this.node.y += this.speed.y * dt
        //this.survivalVFX.node.active = this._enablePowerUp
    }

    setDir(dir: number = 1){
        if(dir < 0) dir = -1
        if(dir > 0) dir = 1
        this.direction = dir
        this.onTurn()
    }

    onJump(){
        if(DataManager.instance.status != ENUM_GAME_STATUS.RUNING) return
        this.jumpCount++
        if(this.jumpCount > this.jumpLimit || this.isClimb()) return
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.JUMP)
        this.status = ENUM_PLAYER_STATUS.JUMP
        this.speed.y = this.jump
    }

    onTurn(){
        if(this.direction){
            this.node.scaleX = Math.abs(this.node.scaleX)
            if(this.direction == -1) this.node.scaleX = Math.abs(this.node.scaleX) * -1
        }
    }

    onAnimPlay(){
        if(this.anim && this.anim.currentClip?.name != this.status){
            this.anim.play(this.status)
        } 
    }

    onCollisionEnter (other: any, self: any) {
        let color = cc.color(243, 175, 197, 255)
        if(other.tag == ENUM_COLLIDER_TAG.LAVA){
            AudioManager.instance.playSound(ENUM_AUDIO_CLIP.DIE)
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_LOSE)
            self.node.active = false
            color = cc.color(226, 69, 109, 255)
            for (let i = 0; i < 5; i++) {
                EventManager.instance.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color })
            }
            return
        }
        if (!this._enablePowerUp) {
            switch (other.tag) {
                case ENUM_COLLIDER_TAG.SPIKE:
                case ENUM_COLLIDER_TAG.BAT:
                case ENUM_COLLIDER_TAG.SAW:
                case ENUM_COLLIDER_TAG.SPIKEBALL:
                case ENUM_COLLIDER_TAG.PIRANHA_PLANT:
                    AudioManager.instance.playSound(ENUM_AUDIO_CLIP.PIRANHA_PLANT)
                case ENUM_COLLIDER_TAG.PLANT_BULLET:
                    AudioManager.instance.playSound(ENUM_AUDIO_CLIP.DIE)
                    EventManager.instance.emit(ENUM_GAME_EVENT.GAME_LOSE)
                    self.node.active = false
                    color = cc.color(226, 69, 109, 255)
                    for (let i = 0; i < 5; i++) {
                        EventManager.instance.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color })
                    }
                    return
                case ENUM_COLLIDER_TAG.CHICKEN:
                    AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CHICKEN_HIT)
                    color = cc.color(255, 255, 255, 255)
                    for (let i = 0; i < 3; i++) {
                        EventManager.instance.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color })
                    }
                    other.node.getComponent(Chicken).onTurn()
                    this.direction = other.node.getComponent(Chicken).getDir() * -1
                    this.onTurn()
                    return
                default:
                    break;
            }
        }
        

        switch (other.tag) {
            case ENUM_COLLIDER_TAG.ENDPOINT:
                //AudioManager.instance.playSound(ENUM_AUDIO_CLIP.WIN)
                EventManager.instance.emit(ENUM_GAME_EVENT.GAME_WIN)
                for(let i = 0; i < 5; i++){
                    EventManager.instance.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, {pos: self.node.position, color})
                }
                return;
            case ENUM_COLLIDER_TAG.TRAMPOLINE:
                AudioManager.instance.playSound(ENUM_AUDIO_CLIP.TRAMPOLINE)
                color = cc.color(255, 255, 255, 255)
                for (let i = 0; i < 3; i++) {
                    EventManager.instance.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color })
                }
                this.status = ENUM_PLAYER_STATUS.CLIMB
                this.speed.y = this.jump * 2
                return
            case ENUM_COLLIDER_TAG.ANANAS:
                AudioManager.instance.playSound(ENUM_AUDIO_CLIP.SPEED_UP);
                this.forceSpeedUp();
                return;
            case ENUM_COLLIDER_TAG.MELON:
                AudioManager.instance.playSound(ENUM_AUDIO_CLIP.POWER_UP);
                this.onPoweredUpVFX();
                return;
            default:
                break;
        }

        if(!(other instanceof cc.BoxCollider)) return
        // 碰撞框
        const otherAabb = other.world.aabb
        const otherPreAabb = other.world.preAabb.clone()
        const selfAabb = self.world.aabb
        const selfPreAabb = self.world.preAabb.clone()
        // 水平碰撞
        otherPreAabb.x = otherAabb.x
        selfPreAabb.x = selfAabb.x
        if(cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
            this.onCollisionEnterX(other, self, otherAabb, selfAabb, otherPreAabb, selfPreAabb)
            return
        }
        // 垂直碰撞
        selfPreAabb.y = selfAabb.y
        otherPreAabb.y = otherAabb.y
        if(cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
            this.onCollisionEnterY(other, self, otherAabb, selfAabb, otherPreAabb, selfPreAabb)
        }
    }

    onCollisionEnterX(other: any, self: any, otherAabb:any, selfAabb: any, otherPreAabb: any, selfPreAabb: any){
        switch(other.tag){
            case ENUM_COLLIDER_TAG.WALL:
            case ENUM_COLLIDER_TAG.BRICK:
            case ENUM_COLLIDER_TAG.BOX:
                if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)){
                    // 修复位置
                    this.node.x += Math.floor(Math.abs(otherAabb.xMax - selfAabb.xMin))
                }else if(this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)){
                    // 修复位置
                    this.node.x -= Math.floor(Math.abs(otherAabb.xMin - selfAabb.xMax))
                }
                this.direction *= -1
                this.onTurn()
            break
            case ENUM_COLLIDER_TAG.LADDER:
                // 位移
                let x = other.node.x  - self.node.x
                // 修改状态
                this.status = ENUM_PLAYER_STATUS.CLIMB
                this.speed.x = 0
                this.speed.y = 0
                // 转向
                this.direction *= -1
                this.onTurn()
                // 缓动修复位置(位置移动到梯子中间)
                this.node.getPosition(v3)
                v3 = v3.add(cc.v3(x, 0, 0))
                cc.tween(this.node).to(0.05, {position: v3}).call(()=>{
                    AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLIMB)
                    this.speed.y = this.jump * 0.5
                }).start()
            break
        }
    }

    onCollisionEnterY(other: any, self: any, otherAabb:any, selfAabb: any, otherPreAabb: any, selfPreAabb: any){
        switch(other.tag){
            case ENUM_COLLIDER_TAG.GROUND:
            case ENUM_COLLIDER_TAG.BRICK:
            case ENUM_COLLIDER_TAG.BOX:
                if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)){
                    // 向下落地
                    this.jumpCount = 0
                    this.status = ENUM_PLAYER_STATUS.WALK
                    this.node.y = (otherPreAabb.yMax - this.canvas.y) + (self.node.height - other.node.height)
                    this.speed.y = 0
                    other.touchingY = true
                    //落地星星动画
                    // const x = self.node.position.x
                    // const y = self.node.position.y - self.node.height / 2
                    // for(let i = 0; i < 3; i++){
                    //     const scale = 0.3 + Math.random() * 0.2
                    //     EventManager.instance.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, {pos: cc.v2(x, y), color: null, scale })
                    // }
                }else if(this.speed.y > 0 && (selfPreAabb.yMin < otherPreAabb.yMin)){
                    // 向上碰撞
                    // 缓动修复位置（爬上头顶ground）
                    this.node.getPosition(v3)
                    v3.y = (otherPreAabb.yMin - this.canvas.y) + self.node.height
                    cc.tween(this.node).to(0.4, {position: v3}).call(()=>{
                        //AudioManager.instance.playSound(ENUM_AUDIO_CLIP.GOAL)
                        EventManager.instance.emit(ENUM_GAME_EVENT.PLAYER_CLIMB_END)
                        EventManager.instance.emit(ENUM_GAME_EVENT.CAMERA_MOVE, {block: other.node.parent})
                        this.status  = ENUM_PLAYER_STATUS.WALK
                        this.jumpCount = 0
                    }).start()
                    this.speed.y = 0
                }else{
                    // 修复卡电梯下的情况
                    // 此时保持climb状态，this.speed.y = this.jump * 0.5
                }
            break
        }
    }

    onCollisionExit(other: any){
        if(other.tag == ENUM_COLLIDER_TAG.BRICK || other.tag == ENUM_COLLIDER_TAG.BOX){
            if(other.touchingY){
                other.touchingY = false
                this.status = ENUM_PLAYER_STATUS.JUMP
            }
        }
    }

    forceSpeedUp() {
        this.walk = 500;
        let timeOutSpeed = setTimeout(() => {
            this.walk = 200;
            clearTimeout(timeOutSpeed);
        }, 5000);
    }

    onPoweredUpVFX()
    {
        this._enablePowerUp = true;
        let shield = this.node.getChildByName("shield")
        shield.active = true;
        shield.scale = 0;
        cc.tween(shield)
        .to(0.3,{scale: 1},{easing: "backOut"})
        .delay(4.7)
        .call(()=>{
            this._enablePowerUp = false
            shield.active = false;
        })
        .start();
    }



}
