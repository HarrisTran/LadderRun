// Created by carolsail 

import { ENUM_AUDIO_CLIP, ENUM_UI_TYPE } from "../Enum";
import AudioManager from "../manager/AudioManager";
import DataManager from "../manager/DataManager";
import SdkManager from "../manager/SdkManager";
import { StaticInstance } from "../StaticInstance";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOverLayer extends BaseLayer {

    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Label)
    flowerNumber : cc.Label = null;

    onEnable(){
        this.score.string = DataManager.instance.score.toString();
        this.flowerNumber.string = DataManager.instance.coins.toString();
    }
}
