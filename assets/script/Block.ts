// Created by carolsail

import { ENUM_GAME_ZINDEX } from './Enum';
import { StaticInstance } from './StaticInstance';
import Coin from './enemies/Coin';
import DataManager from "./manager/DataManager";
import EventManager from './manager/EventManager';

const { ccclass, property } = cc._decorator;

export interface IBlock {
    // 唯一id
    id: number,
    // 坐标x
    x: number,
    // 坐标y
    y: number
}

enum Difficulty {
    EASY = 0,
    MEDIUM,
    HARD,
}

@ccclass
export default class Block extends cc.Component {

    @property({ type: cc.Enum(Difficulty) })
    blockType: Difficulty = Difficulty.EASY;

    id: number = -1
    x: number = 0
    y: number = 0


    init(data: IBlock) {
        Object.assign(this, data)
        DataManager.instance.blocks.push(this)
    }

    rendor() {
        this.node.zIndex = ENUM_GAME_ZINDEX.BLOCK
        this.node.x = this.x
        this.node.y = this.y
    }

    flipXHelper() {
        let objectList = ["ladder","coin","box","ananas","melon2","bat","brick","chicken","plant","spikeball","spike","stone"];
        objectList.forEach(name => {
            let nodes = this.node.children.filter(node => node.name == name);
            if (nodes.length > 0) {
                nodes.map(node => {
                    node.x *= -1;
                    if(["plant","bat"].includes(name)) node.scaleX *= -1;
                })
            }
        })
    }
}
