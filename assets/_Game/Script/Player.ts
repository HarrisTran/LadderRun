import ReverseMovingTrap from "./enemies/ReverseMovingTrap";
import { ENUM_COLLIDER_TAG, ENUM_PLAYER_STATUS, ENUM_GAME_EVENT, GameState, ENUM_AUDIO_CLIP} from "./Enum";
import GameManager from "./manager/GameManager";
import { playParticle3D, setMix } from "./Utils";
var timeScale = 1;
const {ccclass, property} = cc._decorator;

let v3 = new cc.Vec3()
@ccclass
export default class Player extends cc.Component {
    @property(sp.Skeleton) spineSkeleton: sp.Skeleton = null;
    @property(cc.Node) shieldIcon: cc.Node = null;
    @property(cc.Node) magnet: cc.Node = null;
    @property(cc.Node) speedVfx: cc.Node = null;
    @property(cc.Node) coinParticle: cc.Node = null;

    canvas: cc.Node = null
    speed: cc.Vec2 = cc.v2(0, 0)
    walk: number = 160
    direction: number = 0
    jump: number = 600
    jumpCount:number = 0
    jumpLimit: number = 1
    gravity: number = -1700
    _status: ENUM_PLAYER_STATUS = ENUM_PLAYER_STATUS.JUMP
    shield: boolean = false;

    public speedBoosterDuration: number;
    public shieldBoosterDuration: number;
    public magnetBoosterDuration: number;

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

    isDead(){
        return this.status == ENUM_PLAYER_STATUS.DIE
    }
    
    // 是否在攀爬
    isClimb(){
        return this.status == ENUM_PLAYER_STATUS.CLIMB
    }

    protected onLoad(): void {
        this.canvas = cc.find('Canvas')
        cc.game.on(ENUM_GAME_EVENT.PLAYER_JUMP, this.onJump, this);
        this.status = ENUM_PLAYER_STATUS.JUMP;
        setMix(this.spineSkeleton,'move','jump',0.1);
        setMix(this.spineSkeleton,'move','climb',0.1);
        setMix(this.spineSkeleton,'jump','move',0.1);
        setMix(this.spineSkeleton,'jump','climb',0.1);
        setMix(this.spineSkeleton,'climb','move',0.1);
        setMix(this.spineSkeleton,'climb','jump',0.1);
    }

    protected onDestroy(): void {
        cc.game.off(ENUM_GAME_EVENT.PLAYER_JUMP, this.onJump)
    }

    update (dt: number) {
        dt *= GameManager.Instance.timeScale;
        if(this.isAir()) this.speed.y += this.gravity * dt
        if(!this.isClimb()) this.speed.x = this.walk * this.direction
        if(GameManager.Instance.CurrentGameState == GameState.PLAYING && this.status != ENUM_PLAYER_STATUS.DIE) {
            this.node.x += this.speed.x * dt
            this.speedBoosterDuration > 0 ? this.holdSpeedBoosterHandle(dt) : this.cancelSpeedBoosterHandle();
            this.magnetBoosterDuration > 0 ? this.holdMagnetBoosterHandle(dt) : this.cancelMagnetBoosterHandle();
            this.shieldBoosterDuration > 0 ? this.holdShieldBoosterHandle(dt) : this.cancelShieldBoosterHandle();
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
        // if(this.isDead()) return;
        if(GameManager.Instance.CurrentGameState != GameState.PLAYING) return
        this.jumpCount++
        if(this.jumpCount > this.jumpLimit || this.isClimb()) return
        GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.PLAYER_JUMP);
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
        // if(this.anim && this.anim.currentClip?.name != this.status){
        //     this.anim.play(this.status)
        // } 
        
        if(this._status == ENUM_PLAYER_STATUS.CLIMB){
            this.spineSkeleton.setAnimation(0,'climb',true)
        }
        else if(this._status == ENUM_PLAYER_STATUS.WALK){
            //this.spineSkeleton.clearTracks();
            this.spineSkeleton.setAnimation(0,'move',true)
        }
        else if(this._status == ENUM_PLAYER_STATUS.JUMP){
            let track = this.spineSkeleton.setAnimation(0,'jump',false)
            timeScale = 0.2;
        }

    }


    onPlayerDead(){
        cc.game.emit(ENUM_GAME_EVENT.GAME_LOSE);
        this.unscheduleAllCallbacks();
        
        this.status = ENUM_PLAYER_STATUS.DIE;
        let deadTrack = this.spineSkeleton.setAnimation(0,'dead',false);
        this.spineSkeleton.setTrackCompleteListener(deadTrack,(track: sp.spine.TrackEntry,_)=>{
            this.node.active = false;
            //cc.game.emit(ENUM_GAME_EVENT.GAME_LOSE);
        })
    }

    onCollisionEnter (other: any, self: any) {
        switch (other.tag) {
            
            case ENUM_COLLIDER_TAG.REWARD:
                playParticle3D(this.coinParticle);
                
                return;
            case ENUM_COLLIDER_TAG.LAVA:
                for (let i = 0; i < 5; i++) {
                    cc.game.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color: cc.color(226, 69, 109, 255) })
                }
                this.onPlayerDead();
                return;
            case ENUM_COLLIDER_TAG.REVERSE_TRAP:
                for (let i = 0; i < 3; i++) {
                    cc.game.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color: cc.color(255, 255, 255, 255) })
                }
                if(other.node.getComponent(ReverseMovingTrap).dir*this.direction < 0){
                    this.direction *= -1
                    this.onTurn()
                }
                return;
            case ENUM_COLLIDER_TAG.BULLET:
            case ENUM_COLLIDER_TAG.FLY_TRAP:
            case ENUM_COLLIDER_TAG.MOVING_TRAP:
            case ENUM_COLLIDER_TAG.HIDE_TRAP:
            case ENUM_COLLIDER_TAG.SPIKE:
                //GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_STAND);
                if (!this.shield) {
                    for (let i = 0; i < 5; i++) {
                        cc.game.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color: cc.color(226, 69, 109, 255) })
                    }
                    this.onPlayerDead();
                }
                return
            case ENUM_COLLIDER_TAG.TRAMPOLINE:
                GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAMPOLINE)
                for (let i = 0; i < 3; i++) {
                    cc.game.emit(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, { pos: self.node.position, color: cc.color(255, 255, 255, 255) })
                }
                this.status = ENUM_PLAYER_STATUS.CLIMB
                this.speed.y = this.jump * 2
                return
            default:
                break;
        }
        if(!(other instanceof cc.BoxCollider)) return
        const otherAabb = other.world.aabb
        const otherPreAabb = other.world.preAabb.clone()
        const selfAabb = self.world.aabb
        const selfPreAabb = self.world.preAabb.clone()
        otherPreAabb.x = otherAabb.x
        selfPreAabb.x = selfAabb.x
       
        
        if(cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
            this.onCollisionEnterX(other, self, otherAabb, selfAabb, otherPreAabb, selfPreAabb)
            return
        }
        selfPreAabb.y = selfAabb.y
        otherPreAabb.y = otherAabb.y
        if(cc.Intersection.rectRect(selfPreAabb, otherPreAabb)){
            this.onCollisionEnterY(other, self, otherAabb, selfAabb, otherPreAabb, selfPreAabb)
        }
    }

    onCollisionEnterX(other: any, self: any, otherAabb:any, selfAabb: any, otherPreAabb: any, selfPreAabb: any){
        switch(other.tag){
            case ENUM_COLLIDER_TAG.WALL:
            case ENUM_COLLIDER_TAG.HARD_TRAP_WALL:
            case ENUM_COLLIDER_TAG.SOFT_TRAP:
                if (this.speed.x < 0 && (selfPreAabb.xMax > otherPreAabb.xMax)){
                    this.node.x += Math.floor(Math.abs(otherAabb.xMax - selfAabb.xMin))
                }else if(this.speed.x > 0 && (selfPreAabb.xMin < otherPreAabb.xMin)){
                    this.node.x -= Math.floor(Math.abs(otherAabb.xMin - selfAabb.xMax))
                }
                this.direction *= -1
                this.onTurn()
            break
            case ENUM_COLLIDER_TAG.LADDER:
                if(this.isClimb()) return
                let x = other.node.x  - self.node.x
                this.status = ENUM_PLAYER_STATUS.CLIMB
                this.speed.x = 0
                this.speed.y = 0
                this.direction *= -1
                this.onTurn()
                this.node.getPosition(v3)
                v3 = v3.add(cc.v3(x, 0, 0))
                cc.tween(this.node).to(0.05, {position: v3}).call(()=>{
                    GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.PLAYER_CLIMB);
                    this.speed.y = this.jump * 0.3
                }).start()
            break
        }
    }

    onCollisionEnterY(other: any, self: any, otherAabb:any, selfAabb: any, otherPreAabb: any, selfPreAabb: any){
        switch(other.tag){
            case ENUM_COLLIDER_TAG.GROUND:
            case ENUM_COLLIDER_TAG.HARD_TRAP_WALL:
            case ENUM_COLLIDER_TAG.SOFT_TRAP:
                if (this.speed.y < 0 && (selfPreAabb.yMax > otherPreAabb.yMax)){
                    
                    // 向下落地
                    this.jumpCount = 0
                    this.status = ENUM_PLAYER_STATUS.WALK
                    this.node.y = (otherPreAabb.yMax - this.canvas.y) + (self.node.height - other.node.height)+1;
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
                        cc.game.emit(ENUM_GAME_EVENT.PLAYER_CLIMB_END)
                        cc.game.emit(ENUM_GAME_EVENT.CAMERA_MOVE, {block: other.node.parent})
                        this.status  = ENUM_PLAYER_STATUS.WALK
                        this.jumpCount = 0
                    }).start()
                    this.speed.y = 0
                }else{
                    // 修复卡电梯下的情况
                    // 此时保持climb状态，this.speed.y = this.jump * 0.5
                }
                //DataManager.instance.status = ENUM_GAME_STATUS.RUNING
            break
        }
    }

    onCollisionExit(other: any){
        if(other.tag == ENUM_COLLIDER_TAG.HARD_TRAP_WALL || other.tag == ENUM_COLLIDER_TAG.SOFT_TRAP){
            if(other.touchingY){
                other.touchingY = false
                this.status = ENUM_PLAYER_STATUS.JUMP
            }
        }
    }

    public holdSpeedBoosterHandle(dt:number){
        this.speedBoosterDuration -= dt;
        this.speedVfx.active = true;
        this.walk = 300;
    }

    public cancelSpeedBoosterHandle(){
        this.speedBoosterDuration = 0;
        this.speedVfx.active = false;
        this.walk = 150;
    }

    public holdMagnetBoosterHandle(dt :number){
        this.magnetBoosterDuration -= dt;
        this.magnet.active = true;
    }

    public cancelMagnetBoosterHandle(){
        this.magnetBoosterDuration = 0;
        this.magnet.active = false;
    }

    public holdShieldBoosterHandle(dt: number){
        this.shieldBoosterDuration -= dt
        this.shieldIcon.active = true;
        this.shield = true;
    }

    public cancelShieldBoosterHandle(){
        this.shieldBoosterDuration = 0;
        this.shieldIcon.active = false;
        this.shield = false;
    }




}
