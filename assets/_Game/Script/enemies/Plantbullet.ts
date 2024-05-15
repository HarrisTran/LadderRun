// Created by carolsail

import DataManager from '../manager/DataManager';
import { ENUM_GAME_STATUS } from './../Enum';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Plantbullet extends cc.Component {

    dir: number = 0
    speed: number = 200

    setDir(dir: number){
        this.dir = dir
    }

    protected update(dt: number): void {
        if(DataManager.instance.status != ENUM_GAME_STATUS.RUNING) return
        if(this.dir){
            this.node.x += this.speed * this.dir * dt
            if(Math.abs(this.node.x) >= 400) this.node.removeFromParent()
        }
    }
}
