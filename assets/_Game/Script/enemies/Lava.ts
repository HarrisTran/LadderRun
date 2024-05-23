import { ENUM_GAME_STATUS, GameState } from "../Enum";
import { delay } from "../Utils";
import DataManager from "../manager/DataManager";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lava extends cc.Component {
    @property(cc.Node)
    cameraNode : cc.Node = null;

    @property
    lavaSpeed: number = 150;
   
   
    protected update(dt: number): void {
        if (GameManager.Instance.CurrentGameState !== GameState.PLAYING ||
            this.node.position.y > this.cameraNode.position.y) {
            return;
        }
        this.node.y += dt*this.lavaSpeed
    }


}
