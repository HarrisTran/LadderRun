import Reward from "./enemies/Reward";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Magnet extends cc.Component {
    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let block = other.node.parent;
        let player = self.node.parent;
        let canvasSize = cc.Canvas.instance.designResolution;
        
        let playerPos = block.convertToNodeSpaceAR(player.getPosition().addSelf(new cc.Vec2(canvasSize.width,canvasSize.height).multiplyScalar(0.5)));
        
        other.node.getComponent(Reward).getRewardFromMagnet(playerPos);
    }

}
