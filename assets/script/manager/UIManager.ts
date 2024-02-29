
import { ENUM_UI_TYPE } from './../Enum';
import { StaticInstance } from './../StaticInstance';
import BaseLayer from '../layer/Baselayer';
import LoadingLayer from '../layer/LoadingLayer';
import MenuLayer from "../layer/MenuLayer";
import GameLayer from '../layer/GameLayer';
import SettingLayer from '../layer/SettingLayer';
import LoseLayer from '../layer/LoseLayer';
import WinLayer from '../layer/WinLayer';
import LevelLayer from '../layer/LevelLayer';
import SkinLayer from '../layer/SkinLayer';
import MoreLayer from '../layer/MoreLayer';
import ConfirmLayer from '../layer/ConfirmLayer';
import GameOverLayer from '../layer/GameOverLayer';

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(LoadingLayer)
    loadingLayer: LoadingLayer = null
    @property(MenuLayer)
    menuLayer: MenuLayer = null
    @property(GameLayer)
    gameLayer: GameLayer = null
    @property(SettingLayer)
    settingLayer: SettingLayer = null
    @property(LoseLayer)
    loseLayer: LoseLayer = null
    @property(WinLayer)
    winLayer: WinLayer = null
    @property(LevelLayer)
    levelLayer: LevelLayer = null
    @property(SkinLayer)
    skinLayer: SkinLayer = null
    @property(MoreLayer)
    moreLayer: MoreLayer = null
    @property(ConfirmLayer)
    confirmLayer: ConfirmLayer = null
    @property(GameOverLayer)
    gameOverLayer: GameOverLayer = null

    private uiMap = new Map<ENUM_UI_TYPE, BaseLayer>()

    protected onLoad(): void {
        StaticInstance.setUIManager(this)
        this.uiMap.set(ENUM_UI_TYPE.LOADING, this.loadingLayer)
        this.uiMap.set(ENUM_UI_TYPE.MENU, this.menuLayer)
        this.uiMap.set(ENUM_UI_TYPE.GAME, this.gameLayer)
        this.uiMap.set(ENUM_UI_TYPE.SETTING, this.settingLayer)
        this.uiMap.set(ENUM_UI_TYPE.LOSE, this.loseLayer)
        this.uiMap.set(ENUM_UI_TYPE.WIN, this.winLayer)
        this.uiMap.set(ENUM_UI_TYPE.LEVEL, this.levelLayer)
        this.uiMap.set(ENUM_UI_TYPE.SKIN, this.skinLayer)
        this.uiMap.set(ENUM_UI_TYPE.MORE, this.moreLayer)
        this.uiMap.set(ENUM_UI_TYPE.GAME_OVER, this.gameOverLayer)
        this.uiMap.set(ENUM_UI_TYPE.CONFIRM, this.confirmLayer)
    }

    toggle(key: ENUM_UI_TYPE, status: boolean = true, callback?: () => void) {
        if(this.uiMap.has(key)){
           const layer = this.uiMap.get(key)
           status ? layer.show() : layer.hide()
           callback && callback()
        }
    }

    isActive(key: ENUM_UI_TYPE){
        if(this.uiMap.has(key)){
            return this.uiMap.get(key).node.active
        }
        return false
    }

    setSettingStyle(index: number = 0){
        const layer: SettingLayer = this.uiMap.get(ENUM_UI_TYPE.SETTING) as SettingLayer
        layer.setStyle(index)
    }

    setGameGoal(){
        const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer
        layer.setGoal()  
    }

    setGameScore(){
        const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer;
        layer.setScore();
    }

    setGameMaxGoal(){
        const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer
        layer.setMaxGoal()
    }

    setGameMaxScore(){
        const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer
        layer.setMaxScore();
    }
}
