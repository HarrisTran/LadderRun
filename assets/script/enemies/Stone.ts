import { ENUM_COLLIDER_TAG, ENUM_GAME_STATUS } from "../Enum";
import DataManager from "../manager/DataManager";
import PoolManager from "../manager/PoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Stone extends cc.Component {
    animation: cc.Animation = null
    rock: cc.Node = null;
    
    protected onLoad(): void {
        this.animation = this.node.getComponent(cc.Animation);
        this.rock = this.node.getChildByName("rock");
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.PLANT_VIEW){
            this.animation.play("vibrate");
        }
    }

    vibrateDone(){
        cc.tween(this.rock)
        .by(0.8,{y:-280},{easing: "sineIn"})
        .call(()=>this.rock.active = false)
        .to(0.2,{y :0})
        .call(()=>this.rock.active = true)
        .start();
    }

}
