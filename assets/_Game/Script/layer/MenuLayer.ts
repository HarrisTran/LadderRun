
import { ENUM_GAME_EVENT } from "../Enum";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MenuLayer extends BaseLayer {
    onStartClick(){
        cc.game.emit(ENUM_GAME_EVENT.GAME_START);
    }

}
