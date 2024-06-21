
import { ENUM_COLLIDER_TAG } from '../Enum';
import GameManager from '../manager/GameManager';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    speed: number = 150

    onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
        if (self.tag == ENUM_COLLIDER_TAG.BULLET && (other.tag == ENUM_COLLIDER_TAG.WALL || other.tag == ENUM_COLLIDER_TAG.GROUND)){
            this.node.removeComponent(cc.Collider)
            this.node.destroy();
        }
    }

    protected update(dt: number): void {
        if(!GameManager.Instance.isStatePlay()) return
        this.node.x += this.speed * dt
        //if(Math.abs(this.node.x) >= 800) this.node.removeFromParent()
    }
}
