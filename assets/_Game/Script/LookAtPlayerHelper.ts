// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_COLLIDER_TAG } from "./Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LookAtPlayerHelper extends cc.Component {
    private nodeParent : cc.Node;
    protected onLoad(): void {
        this.nodeParent = this.node.parent;
    }
    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER){
            let xPlayer = other.node.position.x;
            let xEnemy = this.nodeParent.position.x;
            let dir = Math.abs(this.nodeParent.scaleX)
            if(xPlayer < xEnemy){
                this.nodeParent.scaleX = -dir;
            }else{
                this.nodeParent.scaleX = dir;
            }
        }
    }
}
