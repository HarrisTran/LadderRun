// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataManager from "../manager/DataManager";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverLayer extends BaseLayer {

   @property(cc.Label)
   score: cc.Label = null;

   @property(cc.Label)
   flowerNumber: cc.Label  = null;  

   protected onEnable(): void {
       this.score.string = DataManager.instance.score.toString();
       this.flowerNumber.string = DataManager.instance.coins.toString();
   }
}
