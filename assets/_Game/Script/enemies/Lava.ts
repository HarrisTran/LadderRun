import { ENUM_GAME_EVENT, ENUM_GAME_STATUS, GameState } from "../Enum";
import { delay } from "../Utils";
import DataManager from "../manager/DataManager";
import GameManager from "../manager/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Lava extends cc.Component {
    @property(cc.Node)
    cameraNode : cc.Node = null;

    @property
    lavaSpeed: number = 0;

    private _shouldMove: boolean = false;

    protected onLoad(): void {
        cc.game.on(ENUM_GAME_EVENT.GAME_START,this.startMove,this);
    }

    async startMove(){
        await delay(3000);
        this._shouldMove = true;
    }
   
   
    protected update(dt: number): void {
        if (!GameManager.Instance.isStatePlay() ||
            this.node.position.y > this.cameraNode.position.y+100) {
            return;
        }
        if(this._shouldMove){
            this.node.y += dt*this.lavaSpeed
        }
        
    }


}
