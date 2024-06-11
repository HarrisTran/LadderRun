// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ENUM_COLLIDER_TAG } from "../Enum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StandTrap extends cc.Component {

    @property(sp.Skeleton)
    private trapAnimation: sp.Skeleton = null;

    onCollisionEnter (other: cc.BoxCollider, self: cc.BoxCollider) {
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER && self.tag == ENUM_COLLIDER_TAG.SPIKE){
            this.trapAnimation.setAnimation(0,'attack',false);
        }
    }
}
