import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG, ENUM_FLY_TRAP_STATUS, GameState } from "../Enum";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;
var TrapHideCellarMode = cc.Enum({
    LOW: 0,
    HIGH: 1,
    RANDOM: 2
})
@ccclass
export default class FlyTrap extends cc.Component {
    @property({type: TrapHideCellarMode}) private mode = TrapHideCellarMode.HIGH;
    _status: ENUM_FLY_TRAP_STATUS = ENUM_FLY_TRAP_STATUS.IDLE
    //anim: cc.Animation = null
    dir: number = 0
    speed: number = 110

    get status(){
        return this._status
    }

    set status(data: ENUM_FLY_TRAP_STATUS){
        this._status = data
        this.onAnimPlay()
    }


    protected start(): void {
        this.node.scaleX = this.node.position.x < 0 ? -1 : 1;
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.FLY_TRAP_VIEW && this.status == ENUM_FLY_TRAP_STATUS.IDLE){
            this.status = ENUM_FLY_TRAP_STATUS.WALL_OUT
            this.speed += Math.random() * 80
            let y : number = 0;
            GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.TRAP_HIDE_CELLAR)
            switch (this.mode) {
                case TrapHideCellarMode.HIGH:
                    y = -130
                    break;
                case TrapHideCellarMode.LOW:
                    y = -260
                    break;
                case TrapHideCellarMode.RANDOM:
                    y = Math.random()*150-200
                    break;
            }
            const act = cc.moveBy(0.5, cc.v2(0, y)).easing(cc.easeCubicActionOut())
            cc.tween(this.node).then(act).call(()=>{
                this.status = ENUM_FLY_TRAP_STATUS.FLY
                this.dir = this.node.position.x < 0 ? 1 : -1
            }).start()
        }
    }

    onAnimPlay(){
        //this.anim.play(this.status)
    }

    protected update(dt: number): void {
        if(!GameManager.Instance.isStatePlay()) return
        if(this.dir){
            dt *= GameManager.Instance.timeScale;
            this.node.x += this.speed * this.dir * dt
            if(Math.abs(this.node.x) >= 400) this.node.removeFromParent()
        }
    }
}
