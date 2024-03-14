
import BackendConnector from "../BackendConnector";
import { ENUM_AUDIO_CLIP, ENUM_GAME_EVENT, ENUM_UI_TYPE } from "../Enum";
import { StaticInstance } from "../StaticInstance";
import AudioManager from "../manager/AudioManager";
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
        this.ticketWarning.string = 
        `Top 1 player: ${BackendConnector.instance.maxScore}`+"\n"+
        `Current Score + Previous Score = Final Score`+"\n"+
        `${BackendConnector.instance.currentScore}+${DataManager.instance.score}=${BackendConnector.instance.currentScore+DataManager.instance.score}`+"\n"+
        `Do you want to continue playing with your current score?`
    }

    onContinueButton()
    {
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        if(DEBUG_MODE){
            EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
            return;
        }
        this.ticketWarning.string = 
        `To continue playing, you will be deducted ${BackendConnector.instance.getTicketCanBeMinus()} extras. Do you want to proceed?`+"\n"+
        `Your extras: ${BackendConnector.instance.numberTicket}`;
        this.continueButton.active = false;
    }

    onDeductedButton()
    {
        let button = this.deductedButton.getComponent(cc.Button);
        button.interactable = false;
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
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
                button.interactable = true;
                this._isLackTicket = true;
                this.ticketWarning.string = `You don't have enough extras to continue playing, would you like to buy more tickets?\n Need ${BackendConnector.instance.getTicketCanBeMinus()} extras`;
            }
        }
    }

    onCancelClick(){
        AudioManager.instance.playSound(ENUM_AUDIO_CLIP.CLICK);
        this.hide();
        this.style1.active = true;
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_OVER);

    }
}
