// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_COLLIDER_TAG } from "../Enum";
import Player from "../Player";
import { delay } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpeedBooster extends cc.Component {
    @property(cc.Integer) protected duration: number = 10;
    player : Player = null;

    onCollisionEnter(other : cc.Collider, self: cc.Collider){
        if(other.tag === ENUM_COLLIDER_TAG.PLAYER){
            this.player = other.node.getComponent(Player);
            this.holdBooster();
        }
    }

    private async holdBooster(){
        await delay(this.duration);
        this.player = null;
    }

}
