// Created by carolsail

import BaseLayer from "./Baselayer";
import item from "./item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseLayer extends BaseLayer {
    @property(cc.Node) private overlay : cc.Node = null;
   @property(cc.Label) private ticketMinus : cc.Label = null;
   @property(cc.ScrollView) private leaderBoardView : cc.ScrollView = null;
   @property(cc.Node) private continueButton : cc.Node = null;
   @property(item) private mainItemRow: item = null;
   @property(cc.Prefab) private itemRowPrefab : cc.Prefab = null;

   private _clickedContinueButton : boolean = false;
   
}
