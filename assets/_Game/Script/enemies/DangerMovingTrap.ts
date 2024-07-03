// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_COLLIDER_TAG } from "../Enum";
import GameManager from "../manager/GameManager";
import { random } from "../Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DangerMovingTrap extends cc.Component {

    dir: number = -1
    speed: number;

    onLoad(){
        this.speed = random(100, 150)
    }

    onCollisionEnter (other: any, self: any) {
        if((other.tag == ENUM_COLLIDER_TAG.WALL || other.tag == ENUM_COLLIDER_TAG.HARD_TRAP_WALL) && self.tag == ENUM_COLLIDER_TAG.MOVING_TRAP){
            if(this.dir){
                this.dir *= -1
                this.node.scaleX = -this.dir ;
            }
        }
        if(other.tag == ENUM_COLLIDER_TAG.PLAYER) GameManager.Instance.audioManager.playSfx(ENUM_AUDIO_CLIP.DANGER_MOVING_TRAP);
    }

    update (dt: number) {
        if(!GameManager.Instance.isStatePlay()) return
        if(this.dir){
            dt *= GameManager.Instance.timeScale;
            this.node.x += this.speed * this.dir * dt
            //this.body.angle += 5;
            //this.body.angle = this.body.angle % 360;
        }
    }
}
