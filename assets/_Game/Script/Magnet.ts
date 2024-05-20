import Reward from "./enemies/Reward";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Magnet extends cc.Component {
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let playerPosition = this.node.position;

        this.node.removeComponent(cc.Collider);
        this.node.active = false;
    }
}
