
import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_REVERSE_TRAP_STATUS, GameState } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReverseMovingTrap extends cc.Component {

    @property(sp.Skeleton)
    private trapAnimation: sp.Skeleton = null;

    _status: ENUM_REVERSE_TRAP_STATUS = ENUM_REVERSE_TRAP_STATUS.IDLE
    //anim: cc.Animation = null
    dir: number = 0
    speed: number = 160

    runSoundId: number = 0;

    get status(){
        return this._status
    }

    set status(data: ENUM_REVERSE_TRAP_STATUS){
        this._status = data
        this.onAnimPlay()
    }

    protected onLoad(): void {
        //this.anim = this.node.getChildByName('body').getComponent(cc.Animation)
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.REVERSE_TRAP_VIEW){

        }
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.REVERSE_TRAP_VIEW && this.status == ENUM_REVERSE_TRAP_STATUS.IDLE){
            this.status = ENUM_REVERSE_TRAP_STATUS.MOVE
            this.speed += Math.random() * 80
            this.dir = 1
            this.onTurn();
        }else if((other.tag == ENUM_COLLIDER_TAG.WALL || 
            other.tag == ENUM_COLLIDER_TAG.HARD_TRAP_WALL || 
            other.tag == ENUM_COLLIDER_TAG.SOFT_TRAP ||
            other.tag == ENUM_COLLIDER_TAG.PLAYER
        ) && self.tag == ENUM_COLLIDER_TAG.REVERSE_TRAP && this.status == ENUM_REVERSE_TRAP_STATUS.MOVE){
            this.onTurn()
            if(other.tag == ENUM_COLLIDER_TAG.PLAYER) GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.REVERSE_MOVING_TRAP)
        }
    }

    onCollisionExit(other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.REVERSE_TRAP_VIEW){
            this.status = ENUM_REVERSE_TRAP_STATUS.IDLE;
            this.dir = 0
            // AudioManager.instance.stopSound(this.runSoundId);
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
        this.trapAnimation.setAnimation(0,this.status,true)
    }

    update (dt: number) {
        if(GameManager.Instance.CurrentGameState != GameState.PLAYING) return
        if(this.dir){
            dt *= GameManager.Instance.timeScale;
            this.node.x += this.speed * this.dir * dt
        }
    }
}
