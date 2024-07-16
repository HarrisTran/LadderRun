import Reward from "./enemies/Reward";
import { ENUM_COLLIDER_TAG } from "./Enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Magnet extends cc.Component {
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag == ENUM_COLLIDER_TAG.REWARD) {
            other.node.getComponent(Reward).getRewardFromMagnet();
        }

    }

}
