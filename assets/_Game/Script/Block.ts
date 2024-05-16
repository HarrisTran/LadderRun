// Created by carolsail

import { ENUM_GAME_ZINDEX, ENUM_ITEM_COLLECTION, ITEM_CODE } from './Enum';
import PoolManager from './manager/PoolManager';

const { ccclass, property } = cc._decorator;

export interface IBlock {
    id: number,
    dataInstance : [[]]
}


@ccclass
export default class Block extends cc.Component {
    @property(cc.Node) private grid: cc.Node = null;

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
                    code == ITEM_CODE.BOOSTER_SPEED
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
