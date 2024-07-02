// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_COLLIDER_TAG } from "../Enum";
import { GachaType } from "../Gacha/GachaManager";
import GameManager from "../manager/GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GachaBooster extends cc.Component {
    @property({type: GachaType}) gachaType = GachaType.FlipCard;

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        if (other.tag === ENUM_COLLIDER_TAG.PLAYER) {
            this.gachaType = GachaType.LuckyChain
            GameManager.Instance.gachaManager.show(this.gachaType);
        }
        this.node.removeComponent(cc.Collider);
        this.node.active = false;
    }

    public setGachaType(id: number){
        this.gachaType = id;
    }
}

