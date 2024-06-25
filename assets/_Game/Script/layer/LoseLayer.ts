
import ScrollViewExtend from "../Common/ScrollViewExtend";
import { GameState } from "../Enum";
import GameManager from "../manager/GameManager";
import BaseLayer from "./Baselayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoseLayer extends BaseLayer {
    @property(cc.Node) private overlay : cc.Node = null;
    @property(cc.Node) private panel: cc.Node = null;
   @property(cc.Label) private ticketMinus : cc.Label = null;
   @property(ScrollViewExtend) private leaderBoardView : ScrollViewExtend = null;
   @property(cc.Node) private continueButton : cc.Node = null;
   @property(cc.Prefab) private itemRowPrefab : cc.Prefab = null;
   @property(cc.SpriteFrame) playerFrame: cc.SpriteFrame = null;

   @property(cc.Node) txtLoading: cc.Node = null;

   private _clickedContinueButton : boolean = false;

   private _clickedQuitGameButton: boolean = false;


    protected onLoad(): void {
        //this.overlay.on('click',this.exitGame);
    }

    public showPopup(){
        this.node.active = true;
        this.panel.scale = 0;
        cc.tween(this.panel).delay(0.5).to(0.5,{scale: 1},{easing: "backOut"}).start();
    }

    protected onEnable() {
        const numbetTicket = GameManager.Instance.APIManager.getTicketCanBeMinus();
        this.ticketMinus.string = '-'+numbetTicket.toString();

        this.scheduleOnce(this.exitGame,60);
        this._updateLeaderBoard();
    }

    private async _updateLeaderBoard(){
        this.txtLoading.active = true;
        let userId = GameManager.Instance.APIManager.userId;
        
        let participants = await GameManager.Instance.APIManager.getLeaderboardInGame();
        
        let player = participants.find(user => user.userid == userId);

        //if(!player) return;
        if(!player) {
            participants.push({userid: userId,score: 0})
        }
       
        player.score += GameManager.Instance.playerDataManager.getScore();
        participants = participants.sort((a,b)=> b.score - a.score);

        let indexAfterSort = participants.findIndex(participant => participant.userid == userId);
        
        this.txtLoading.active = false;

        this.leaderBoardView.createBoard(participants.map(participant =>participant.score),indexAfterSort+1,player.score,this.itemRowPrefab)
        
    }

    private onClickContinue(){
        // GameManager.Instance.ChangeState(GameState.PLAYING);
        // return;
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
        GameManager.Instance.APIManager.postScoreToServer();
        GameManager.Instance.APIManager.postScoreWebEvent()
    }

    onClickQuitGame(){
        if(!this._clickedQuitGameButton){
            this._clickedQuitGameButton = true;
            this.exitGame();
        }
    }
   
}
