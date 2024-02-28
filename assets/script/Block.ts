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
    ncoins: number = 0

    protected onLoad(): void {
        this.node.on("GOT_COIN", this.gotCoinEvent, this);
    }

    gotCoinEvent() {
        if (this.ncoins > 0) this.ncoins--;
        if (this.ncoins == 0) {
            DataManager.instance.score += 100;
            DataManager.instance.save()
            StaticInstance.uiManager.setGameScore()
        }
    }

    init(data: IBlock) {
        Object.assign(this, data)
        DataManager.instance.blocks.push(this)
        this.node.children.forEach(c => {
            if (c.name == "coin") this.ncoins++;
        })
    }

    rendor() {
        this.node.zIndex = ENUM_GAME_ZINDEX.BLOCK
        this.node.x = this.x
        this.node.y = this.y
    }

    flipXHelper() {
        this.makeSymmetrical("ladder");
        this.makeSymmetrical("coin");
        this.makeSymmetrical("box");
        this.makeSymmetrical("ananas");
        this.makeSymmetrical("melon");
        this.makeSymmetrical("bat");
        this.makeSymmetrical("brick");
        this.makeSymmetrical("chicken");
        this.makeSymmetrical("plant");
        this.makeSymmetrical("spikeball");
        this.makeSymmetrical("spike");
    }

    makeSymmetrical(nameOfNode: string){
        let nodes = this.node.children.filter(node => node.name == nameOfNode);
        if(nodes.length > 0){
            nodes.map(node => {
                node.x *= -1;
                node.scaleX *= -1;
            })
        }
    }
}
