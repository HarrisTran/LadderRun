import { ENUM_GAME_EVENT} from "../Enum";
import { delay } from "../Utils";
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
        this.node.getComponent(cc.BoxCollider).enabled = false;
    }

    async startMove(){
        await delay(7000);
        this._shouldMove = true;
        this.node.getComponent(cc.BoxCollider).enabled = true;
    }
   
   
    protected update(dt: number): void {
        
        if (!GameManager.Instance.isStatePlay() ||
            this.node.position.y > this.cameraNode.position.y+100) {
            return;
        }
        if(this._shouldMove){
            dt *= GameManager.Instance.timeScale;
            this.node.y += dt*this.lavaSpeed
        }
        
    }


}
