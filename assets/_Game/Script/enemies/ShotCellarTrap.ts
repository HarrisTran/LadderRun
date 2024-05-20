import { ENUM_COLLIDER_TAG } from "../Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShotCellarTrap extends cc.Component {
    @property(cc.Node) rock : cc.Node = null;

    //animation: cc.Animation = null
    
    protected onLoad(): void {
        //this.animation = this.node.getComponent(cc.Animation);
        this.rock = this.node.getChildByName("rock");
    }

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.HIDE_TRAP_VIEW){
            cc.tween(this.rock)
                .by(0.9, { y: -270 }, { easing: "sineIn"})
                .removeSelf()
                .start();
        }
    }
}
