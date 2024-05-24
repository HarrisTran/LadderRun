// Created by carolsail

import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_GAME_TYPE, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from './../StaticInstance';
import AudioManager from "../manager/AudioManager";
import BaseLayer from "./Baselayer";
import DataManager from "../manager/DataManager";
import EventManager from "../manager/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuLayer extends BaseLayer {

    onStartClick(){
        cc.game.emit(ENUM_GAME_EVENT.GAME_START);
    }

}
