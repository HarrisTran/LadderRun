import { ENUM_COLLIDER_TAG, ENUM_FLY_TRAP_STATUS, GameState } from "../Enum";
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
    speed: number = 100

    get status(){
        return this._status
    }

    set status(data: ENUM_FLY_TRAP_STATUS){
        this._status = data
        this.onAnimPlay()
    }

    protected onLoad(): void {
        this.node.scaleX = this.node.position.x < 0 ? 1 : -1;
        //this.anim = this.node.getChildByName('body').getComponent(cc.Animation)
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.FLY_TRAP_VIEW && this.status == ENUM_FLY_TRAP_STATUS.IDLE){
            this.status = ENUM_FLY_TRAP_STATUS.WALL_OUT
            this.speed += Math.random() * 80
            let y : number = 0;
            switch (this.mode) {
                case TrapHideCellarMode.HIGH:
                    y = -50
                    break;
                case TrapHideCellarMode.LOW:
                    y = -250
                    break;
                case TrapHideCellarMode.RANDOM:
                    y = cc.randomRangeInt(-200,-50);
                    break;
            }
            const act = cc.moveBy(0.5, cc.v2(0, y)).easing(cc.easeCubicActionOut())
            cc.tween(this.node).then(act).call(()=>{
                this.status = ENUM_FLY_TRAP_STATUS.FLY
                this.dir = this.node.x < 0 ? 1 : -1
                this.node.scaleX = this.dir
            }).start()
        }
    }

    onAnimPlay(){
        //this.anim.play(this.status)
    }

    protected update(dt: number): void {
        if(!GameManager.Instance.isStatePlay()) return
        if(this.dir){
            this.node.x += this.speed * this.dir * dt
            if(Math.abs(this.node.x) >= 400) this.node.removeFromParent()
        }
    }
}
