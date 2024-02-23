
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

    @property(cc.Node)
    deductedButton : cc.Node = null;

    @property(cc.Node)
    continueButton : cc.Node = null;

    substractTicketNumber : number = 0;
    private _isLackTicket :  boolean = false;

    protected onEnable(): void {
        this.style1.active = false;
        if(DEBUG_MODE) return;
        let ticket = BackendConnector.instance.getTicketCanBeMinus();
        this.ticketWarning.string = `To continue playing, you will be deducted ${ticket} ticket`;
        this.ticketWarning.string = 
        `Your score: ${DataManager.instance.coins + BackendConnector.instance.currentScore}`+"\n"+
        `Top 1 player: ${BackendConnector.instance.maxScore}`+"\n"+
        `Do you want to continue playing with your current score?`
    }
    onContinueButton()
    {
        console.log("continue button");
        if(DEBUG_MODE){
            this.continueButton.active = false;
        }
        this.ticketWarning.string = 
        `To continue playing, you will be deducted ${BackendConnector.instance.getTicketCanBeMinus()} extras. Do you want to proceed?`+"\n"+
        `Your extras: ${BackendConnector.instance.numberTicket}`;
        this.continueButton.active = false;
    }

    onDeductedButton()
    {
        console.log("deducted button");
        if(DEBUG_MODE){
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            return;
        }
        if(this._isLackTicket){
            BackendConnector.instance.postMessage();
        }else{
            if (BackendConnector.instance.canRelive()) {
                BackendConnector.instance.checkGameScoreTicket()
                    .then(() => {
                        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
                    })
                    .catch(() => {
                        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER)
                    })
            } else {
                this._isLackTicket = true;
                this.ticketWarning.string = `You don't have enough extras to continue playing, would you like to buy more tickets?\n Need ${BackendConnector.instance.getTicketCanBeMinus()} extras`;
            }
        }
    }

    onCancelClick(){
        this.hide();
        this.style1.active = true;
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER);

    }
}
