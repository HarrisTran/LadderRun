// Created by carolsail

import { ENUM_GAME_ZINDEX, ENUM_ITEM_COLLECTION, ITEM_CODE } from './Enum';
import item from './layer/item';
import PoolManager from './manager/PoolManager';
import { randomInList } from './Utils';

const { ccclass, property } = cc._decorator;

export interface IBlock {
    id: number,
    dataInstance : [[]]
}


@ccclass
export default class Block extends cc.Component {
    @property(cc.Node) private grid: cc.Node = null;
    @property([cc.SpriteFrame]) private blockBGSpriteFrame : cc.SpriteFrame[] = [];

    id: number = -1
    dataInstance = [[]]

    init(data: IBlock) {
        this.id = data.id;
        this.dataInstance = data.dataInstance;
    }

    rendor() {
        this.node.zIndex = ENUM_GAME_ZINDEX.BLOCK
        this._rendorInternal();
    }

    private _rendorInternal(){
        this.grid.getComponent(cc.Sprite).spriteFrame = randomInList(this.blockBGSpriteFrame);
        for(let i=0; i < this.dataInstance.length; i++){
            for(let j=0; j < this.dataInstance[0].length; j++){
                let code : ITEM_CODE = this.dataInstance[i][j];
                if( code == ITEM_CODE.LONG_LADDER ||
                    code == ITEM_CODE.MEDIUM_LADDER ||
                    code == ITEM_CODE.SHORT_LADDER ||
                    code == ITEM_CODE.REWARD_1 ||
                    code == ITEM_CODE.REWARD_2 ||
                    code == ITEM_CODE.BOOSTER_MAGNET ||
                    code == ITEM_CODE.BOOSTER_SHIELD ||
                    code == ITEM_CODE.BOOSTER_SPEED ||
                    code == ITEM_CODE.HARD_TRAP_WALL ||
                    code == ITEM_CODE.DANGER_MOVING_TRAP ||
                    code == ITEM_CODE.CIRCLE_MOVING_TRAP ||
                    code == ITEM_CODE.IDLE_MOVING_TRAP ||
                    code == ITEM_CODE.RANDOM_MOVING_TRAP || 
                    code == ITEM_CODE.SPIKE ||
                    code == ITEM_CODE.LOW_FLY_TRAP ||
                    code == ITEM_CODE.HIGH_FLY_TRAP ||
                    code == ITEM_CODE.RANDOM_FLY_TRAP ||
                    code == ITEM_CODE.TRAP_HIDE_STAND ||
                    code == ITEM_CODE.TRAP_SHOT_REAR ||
                    code == ITEM_CODE.SOFT_TRAP_WALL ||
                    code == ITEM_CODE.REVERSE_MOVING_TRAP ||
                    code == ITEM_CODE.TRAMPOLINE ||
                    code == ITEM_CODE.TRAP_SHOT_CELLAR
                ){
                    PoolManager.instance.getNode(ENUM_ITEM_COLLECTION[code],this.node,this.grid.children[15*i+j].position)
                }
            }
        }
    }

    // flipXHelper() {
    //     let objectList = ["ladder","coin","box","ananas","melon2","bat","brick","chicken","plant","spikeball","spike","stone"];
    //     objectList.forEach(name => {
    //         let nodes = this.node.children.filter(node => node.name == name);
    //         if (nodes.length > 0) {
    //             nodes.map(node => {
    //                 node.x *= -1;
    //                 if(["plant","bat","ladder"].includes(name)) node.scaleX *= -1;
    //             })
    //         }
    //     })
    // }
}
