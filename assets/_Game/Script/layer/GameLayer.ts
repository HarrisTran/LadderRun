import {ENUM_GAME_EVENT} from "../Enum";
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
        this.setGameScore()
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

}
