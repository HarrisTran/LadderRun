// Created by carolsail

import { random } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Saw extends cc.Component {

    // 速度
    speed: number = 200
    // 顺时针或逆时针
    dir: number = 1
    // 弧度(针对圆周运动)
    radian: number = 0
    // 半径(针对圆周运动)
    circleRadius: number = 100
    // 圆心(针对圆周运动)
    circleCenter: cc.Vec2 = cc.v2(0, 0)

    onLoad () {
        this.speed = random(200, 400)
        this.dir =  random(-1, 1)
        if(this.dir != 0) this.schedule(this.circleMove, 0.01);
    }

    circleMove(dt: number){
        // 先计算弧度
        this.radian += dt * (this.speed / 100) * this.dir;
        let x = this.circleRadius * Math.cos(this.radian) + this.circleCenter.x;
        let y = this.circleRadius * Math.sin(this.radian) + this.circleCenter.y;
        this.node.position = cc.v3(x, y, 0);
        // Math.atan2 反正切函数 返回从X轴到某个点的角度（以弧度为单位）。
        let angle = Math.atan2(y, x) / (Math.PI / 180);
        this.node.angle = angle;
    }

    setSpeed(speed: number){
        this.speed = speed
        if(speed == 0){
            this.unscheduleAllCallbacks()
        }
    }
}
