// Created by carolsail 

import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingLayer extends BaseLayer {
    @property(cc.Sprite) loadingProgress: cc.Sprite = null;

   public setProgressBar(value : number){
       value = cc.misc.clamp01(value);
       this.loadingProgress.fillRange = value;
   }

}
