
import BackendConnector from "../BackendConnector";
import { ENUM_GAME_EVENT, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import DataManager from "../manager/DataManager";
import EventManager from "../manager/EventManager";
import { DEBUG_MODE } from "../manager/GameManager";
import BaseLayer from "./Baselayer";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ConfirmLayer extends BaseLayer {

    @property(cc.Label)
    ticketWarning: cc.Label = null;

    @property(cc.Node)
    style1 : cc.Node = null;

    substractTicketNumber : number = 0;

    protected onEnable(): void {
        this.style1.active = false;
        if(DEBUG_MODE) return;
        let ticket = BackendConnector.instance.getTicketCanBeMinus();
        this.ticketWarning.string = `To continue playing, you will be deducted ${ticket} ticket`;
    }

    onAgreeClick()
    {
        if(DEBUG_MODE){
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            return;
        }
        if(BackendConnector.instance.canRelive()){
            BackendConnector.instance.checkGameScoreTicket()
            .then(()=>{
                EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            })
            .catch(()=>{
                EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
            })
        }else{
            BackendConnector.instance.postMessage();
            
        }
    }

    onCancelClick(){
        this.hide();
        this.style1.active = true;
        //EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER);

    }
}
