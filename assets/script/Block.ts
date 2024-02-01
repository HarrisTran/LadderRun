// Created by carolsail

import { ENUM_GAME_ZINDEX } from './Enum';
import DataManager from "./manager/DataManager";

const {ccclass, property} = cc._decorator;

export interface IBlock {
    // 唯一id
    id: number,
    // 坐标x
    x: number,
    // 坐标y
    y: number
}

@ccclass
export default class Block extends cc.Component {
    @property
    levelType: string = "";
    
    id: number = -1
    x: number = 0
    y: number = 0

    init(data: IBlock){
        Object.assign(this, data)
        DataManager.instance.blocks.push(this)
    }

    rendor(){
        this.node.zIndex = ENUM_GAME_ZINDEX.BLOCK
        this.node.x = this.x
        this.node.y = this.y
    }
}
