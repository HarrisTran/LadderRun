import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_STATUS, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import GameManager from "../manager/GameManager";
import PoolManager from "../manager/PoolManager";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLayer extends BaseLayer {

    @property(cc.Label)
    coinsLabel: cc.Label = null

    @property(cc.Node)
    pickupTarget: cc.Node = null;

    @property(cc.Prefab)
    coinVfxPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    diamondVfxPrefab: cc.Prefab = null;


    onEnable(){
        //PoolManager.instance.getNode('player', this.node,this.node.convertToNodeSpaceAR(cc.v3(0)))
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.historyNode.active = DataManager.instance.type == ENUM_GAME_TYPE.LOOP
    }


    pickUpCoin(pos: cc.Vec3){
        let o = PoolManager.instance.getNode(this.coinVfxPrefab, this.node, this.node.convertToNodeSpaceAR(pos).addSelf(cc.v3(0,100)))
        cc.tween(o)
        .to(1,{position: this.pickupTarget.position},{easing: "circOut"})
        .removeSelf()
        .start();
    }

    pickUpDiamond(pos: cc.Vec3){
        let o = PoolManager.instance.getNode(this.diamondVfxPrefab, this.node, this.node.convertToNodeSpaceAR(pos).addSelf(cc.v3(0,100)))
        cc.tween(o)
        .to(1,{position: this.pickupTarget.position},{easing: "circOut"})
        .removeSelf()
        .start();
    }

    onTouchStart(e: cc.Event.EventTouch){
        cc.game.emit(ENUM_GAME_EVENT.PLAYER_JUMP)
    }

    public setGameScore(){
        this.coinsLabel.string = GameManager.Instance.playerDataManager.getScore().toString();
    }

    public convertPositionToWorldSpace(pos: cc.Vec3){
        return this.node.convertToWorldSpaceAR(pos);
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
