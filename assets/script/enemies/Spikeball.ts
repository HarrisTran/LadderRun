// Created by carolsail

import { ENUM_COLLIDER_TAG, ENUM_GAME_STATUS } from "../Enum";
import DataManager from "../manager/DataManager";
import { random } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Spikeball extends cc.Component {

    dir: number = 1
    speed: number = 300

    onLoad(){
        this.speed = random(300, 650)
    }

    onCollisionEnter (other: any, self: any) {
        if((other.tag == ENUM_COLLIDER_TAG.WALL || other.tag == ENUM_COLLIDER_TAG.BRICK) && self.tag == ENUM_COLLIDER_TAG.SPIKEBALL){
            this.onTurn()
        }
    }

    onTurn(){
        if(this.dir){
            this.dir *= -1
            this.node.scaleX = this.dir * -1
        }
    }

    update (dt: number) {
        if(DataManager.instance.status != ENUM_GAME_STATUS.RUNING) return
        if(this.dir){
            this.node.x += this.speed * this.dir * dt
            this.node.angle -= 10 * this.dir;
            this.node.angle = this.node.angle % 360;
        }
    }
}
