
import { ENUM_COLLIDER_TAG } from "../Enum";
import Player from "../Player";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export class MagnetBooster extends cc.Component {
    duration: number = 10;

    onCollisionEnter(other : cc.Collider, self: cc.Collider){
        if(other.tag === ENUM_COLLIDER_TAG.PLAYER){
            other.node.getComponent(Player).magnetBoosterDuration = this.duration;

            this.node.removeComponent(cc.Collider);
            this.node.active = false;
        }
    }


}
