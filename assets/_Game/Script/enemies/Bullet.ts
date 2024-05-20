
import GameManager from '../manager/GameManager';
import { GameState } from './../Enum';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    speed: number = 200

    protected update(dt: number): void {
        if(GameManager.Instance.CurrentGameState != GameState.PLAYING) return
        this.node.x += this.speed * dt
        if(Math.abs(this.node.x) >= 800) this.node.removeFromParent()
    }
}
