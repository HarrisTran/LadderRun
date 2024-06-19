
import GameManager from '../manager/GameManager';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    speed: number = 150

    protected update(dt: number): void {
        if(!GameManager.Instance.isStatePlay()) return
        this.node.x += this.speed * dt
        if(Math.abs(this.node.x) >= 800) this.node.removeFromParent()
    }
}
