
import { ENUM_COLLIDER_TAG } from "../Enum";
import Player from "../Player";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export class ShieldBooster extends cc.Component {
    duration: number = 10;

    onCollisionEnter(other : cc.Collider, self: cc.Collider){
        if(other.tag === ENUM_COLLIDER_TAG.PLAYER){
            other.node.getComponent(Player).randomBoosterDuration = this.duration;

            this.node.removeComponent(cc.Collider);
            this.node.active = false;
        }
    }

}
