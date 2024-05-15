import BackendConnector from "../BackendConnector";
import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_STATUS, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLayer extends BaseLayer {

    @property(cc.Label)
    coinsLabel: cc.Label = null

    @property(cc.Node)
    pickupTarget: cc.Node = null;


    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.historyNode.active = DataManager.instance.type == ENUM_GAME_TYPE.LOOP
    }

    onTouchStart(e: cc.Event.EventTouch){
        cc.game.emit(ENUM_GAME_EVENT.PLAYER_JUMP)
    }



    protected onDisable(): void {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
    }

    // public spawnCoinAtPosition(position: cc.Vec3){ // world to local
    //     const pos = position.add(new cc.Vec3(0, -200, 0))
    //     const coin = PoolManager.instance.getNode('coin', this.node, pos);
    //     cc.tween(coin)
    //     .to(1,{position: this.pickupTarget.position},{easing: "sineOut"})
    //     .call(()=>{
    //         coin.removeFromParent();
    //     })
    //     .start();
    // }
}
