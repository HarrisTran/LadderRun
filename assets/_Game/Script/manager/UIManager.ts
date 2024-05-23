
import LoadingLayer from '../layer/LoadingLayer';
import MenuLayer from "../layer/MenuLayer";
import GameLayer from '../layer/GameLayer';
import LoseLayer from '../layer/LoseLayer';
import { GameState } from '../Enum';

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {

    @property(LoadingLayer) loadingLayer: LoadingLayer = null
    @property(MenuLayer) menuLayer: MenuLayer = null
    @property(GameLayer) gameLayer: GameLayer = null
    @property(LoseLayer) loseLayer: LoseLayer = null

    

    public changeState(state : GameState)
    {
        this.loadingLayer.hide();
        this.menuLayer.hide();
        this.gameLayer.hide();
        this.loseLayer.hide();

        switch (state) {
            case GameState.LOADING:
                this.loadingLayer.show();
                break;
            case GameState.MAIN_MENU:
                this.menuLayer.show();
                break;
            case GameState.PLAYING:
                this.gameLayer.show();
                break;
            // case GameState.REPLAY:
            //     this.changeState(GameState.PLAYING);
            //     break;
            case GameState.ENDGAME:
                this.loseLayer.show();
                break;
        }
    }
    // protected onLoad(): void {
    //     StaticInstance.setUIManager(this)
    //     this.uiMap.set(ENUM_UI_TYPE.LOADING, this.loadingLayer)
    //     this.uiMap.set(ENUM_UI_TYPE.MENU, this.menuLayer)
    //     this.uiMap.set(ENUM_UI_TYPE.GAME, this.gameLayer)
    //     this.uiMap.set(ENUM_UI_TYPE.LOSE, this.loseLayer)
    // }

    // toggle(key: ENUM_UI_TYPE, status: boolean = true, callback?: () => void) {
    //     if(this.uiMap.has(key)){
    //        const layer = this.uiMap.get(key)
    //        status ? layer.show() : layer.hide()
    //        callback && callback()
    //     }
    // }

    // isActive(key: ENUM_UI_TYPE){
    //     if(this.uiMap.has(key)){
    //         return this.uiMap.get(key).node.active
    //     }
    //     return false
    // }


    setGameScore(){
        this.gameLayer.setGameScore();
    }

    // setGameMaxGoal(){
    //     const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer
    //     layer.setMaxGoal()
    // }

    // setGameMaxScore(){
    //     const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer
    //     layer.setMaxScore();
    // }

    // spawnCoinAtPosition(position: cc.Vec3){
    //     const layer: GameLayer = this.uiMap.get(ENUM_UI_TYPE.GAME) as GameLayer
    //     return layer.spawnCoinAtPosition(position)
    // }
}
