// Created by carolsail

import { ENUM_GAME_EVENT } from './Enum';
import EventManager from "./manager/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Camera extends cc.Component {

    // 位移目标位置为下一个block中心
    targetPos: cc.Vec2 = cc.Vec2.ZERO
    offsetY: number = 300

    onLoad () {
        EventManager.instance.on(ENUM_GAME_EVENT.CAMERA_MOVE, this.onCameraMove, this)
    }

    protected onDestroy(): void {
        EventManager.instance.off(ENUM_GAME_EVENT.CAMERA_MOVE, this.onCameraMove)
    }

    onCameraMove({block, reset}){
        if(!block) return
        const pos = block.getPosition()
        this.targetPos.x = pos.x
        this.targetPos.y = pos.y + this.offsetY
        if(reset) this.node.setPosition(this.targetPos)
    }

    update (dt: number) {
        // 相机所在位置
        let currentPos = this.node.getPosition()
        // 平滑过度
        currentPos.lerp(this.targetPos, 0.02, currentPos)
        this.node.setPosition(currentPos)
    }
}
