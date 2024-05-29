// Created by carolsail

import { ParticipantInfo } from "../BEConnector";
import { GameState } from "../Enum";
import GameManager from "../manager/GameManager";
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

   private _numberItemRowCanShow: number = 6;

    protected onLoad(): void {
        this.overlay.on('click',this.exitGame);
    }

    protected onEnable(): void {
        // GameManager.Instance.APIManager.postScoreToServer()
        const numbetTicket = GameManager.Instance.APIManager.getTicketCanBeMinus();
        this.ticketMinus.string = '-'+numbetTicket.toString();

        this.scheduleOnce(this.exitGame,60);
        this._updateLeaderBoard();
    }

    private async _updateLeaderBoard(){
        let index : number = 1;
        this.leaderBoardView.content.removeAllChildren();

        let participants = await GameManager.Instance.APIManager.postScoreToServer()
        //let participants : ParticipantInfo[] = [{userId: "1",sum: 1000}, {userId: "2",sum:800},{userId: "3",sum:500}]
        
        let listTop = participants.slice(0,this._numberItemRowCanShow+1);
        let currentScore = GameManager.Instance.playerDataManager.getScore() + GameManager.Instance.APIManager.currentScore;
        
        for(let info of listTop){
            let row = cc.instantiate(this.itemRowPrefab);
            row.setParent(this.leaderBoardView.content);
            row.getComponent(item).createItemRow(index,info.sum);
            // if(info.sum == currentScore){
            //     row.getComponent(item).createItemRow(index,info.sum,true);
            // }
            row.active = true;
            index++;
        }

        let ranking = listTop.findIndex(i=>i.sum == currentScore)+1;
        
        
        if(ranking <= 0) return;
        if(ranking > this._numberItemRowCanShow){
            this.mainItemRow.node.active = true;
            this.mainItemRow.createItemRow(ranking,currentScore);
        }
        else{
            this.mainItemRow.node.active = false;
        }
    }

    private onClickContinue(){
        if(this._clickedContinueButton) return;
        this._clickedContinueButton = true;
        if(GameManager.Instance.APIManager.canRelive()){
            GameManager.Instance.APIManager
                .checkGameScoreTicket()
                .then(() => {
                    this._clickedContinueButton = false;
                    GameManager.Instance.ChangeState(GameState.PLAYING);
                    this.continueButton.active = false;
                }) 
                .catch(()=>{
                    this._clickedContinueButton = false;
                    GameManager.Instance.ChangeState(GameState.ENDGAME);
                })
        }else{
            this._clickedContinueButton = false;
            GameManager.Instance.APIManager.postMessage();
        }
    }

    protected onDisable(): void {
        this.unschedule(this.exitGame);
    }

    private exitGame(){
        //GameManager.Instance.APIManager.postScoreWebEvent();
        GameManager.Instance.APIManager.postScoreWebEvent()
    }
   
}
