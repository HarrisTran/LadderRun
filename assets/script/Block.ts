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

    @property({ type: cc.Integer })
    blockType: number = 0;

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
            DataManager.instance.coins += 100;
            DataManager.instance.save()
            StaticInstance.uiManager.setGameCoins()
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
        //this.node.getChildByName("blockInfo").getComponentInChildren(cc.Label).string = this.id.toString();
    }

    flipXHelper() {
        let ladder = this.node.getChildByName("ladder");
        let bat = this.node.getChildByName("bat");
        let spikeball = this.node.getChildByName("spikeball");
        let trampoline: cc.Node = this.node.getChildByName('trampoline');
        let plant: cc.Node = this.node.getChildByName('plant');
        ladder.x *= -1
        ladder.scaleX *= -1
        if (bat) bat.x *= -1
        if (spikeball) spikeball.x *= -1
        if (trampoline) trampoline.x *= -1
        if (plant) {
            plant.x *= -1
            plant.scaleX *= -1
        }
    }
}
