import * as CryptoES from "crypto-js";
import DataManager from './manager/DataManager';
import { ENUM_GAME_EVENT } from "./Enum";
import EventManager from "./manager/EventManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class BackendConnector {
    public static _instance: BackendConnector = null;

    private token: string;
    private skinId: string;
    private tournamentId: string;
    private key: string;
    private deviceInfo: string;

    // Ticket infors
    public numberTicket: number;
    public maxScore: number;
    private mileStone: string;
    public currentScore : number ;

    private gameURL: string = "";

    public static get instance(){
        if (null == this._instance) {
            this._instance = new BackendConnector();
        }
        return this._instance;
    }

    constructor()
    {
        this.getGameData();
    }

    public getGameData() {
        let url = new URLSearchParams(window.location.search);

        this.token = url.get('token');
        this.skinId = url.get('skinId');
        this.tournamentId = url.get('tournamentId');
        this.deviceInfo = url.get('deviceInfo')


        this.numberTicket = parseInt(url.get('numberTicket'));
        this.maxScore =  parseInt(url.get('maxScore'));
        this.currentScore = parseInt(url.get('currentScore'));
        this.mileStone = url.get("mileStone");

        this.gameURL = ENV_CONFIG[url.get('env')];

        
    }

    public async authenticate() {
        await fetch(`${this.gameURL}/promotions/authenticate-tournament?token=${this.token}&tournamentId=${this.tournamentId}&skinId=${this.skinId}&deviceInfo=${this.deviceInfo}`)
        .then((response) => {
            if(response.ok){
                return response.json();
            }
        })
        .then(data=>{
            if(data.ResultCode == 1) {
                this.key = data.Data.Key;
                console.log("authen success",this.key);
            }
            else{
                throw new Error("");
            }
        })
        .catch(err => console.log("authen failed"));
    }

    public ticketMinus(type: "auth"|"revive") {
        let numberTicket = type === "auth" ? 1 : this.getTicketCanBeMinus();
        let dataEncrypted : string = this.getDataEncrypted({type: type, total: numberTicket});
        
        fetch(`${this.gameURL}/promotions/ticket-minus/${this.tournamentId}/${this.skinId}?cocos=1`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-refactor-token': this.token,
            },
            method: "POST",
            body: JSON.stringify({data: dataEncrypted})
        })
        .then(()=>{
            this.numberTicket -= numberTicket;
            console.log("ticket minus: ",this.numberTicket);
        })
    }

    public calculatingTicketToContinue(scoreRange: object, yourScore: number)
    {   
        //scoreRange = {"0":1,"2000":2,"4000":3} // to test
        let closestMilestone;

        for (const milestone in scoreRange) {
            if(parseInt(milestone) <= yourScore) {
                closestMilestone = { value: scoreRange[milestone] };
            }
        }

        if(!closestMilestone) {
                const minValue = Math.min(...Object.values(scoreRange));
                closestMilestone = { value: minValue };
        }
        
        const { value } = closestMilestone
        return value
        
    }
    
    public async checkGameScoreTicket(){
        let dataEncrypted : string = this.getDataEncrypted({score: DataManager.instance.score, ticket: this.getTicketCanBeMinus()})

        await fetch(`${this.gameURL}/promotions/check-game-score-ticket/${this.tournamentId}/${this.skinId}?cocos=1`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-refactor-token': this.token,
            },
            method: "POST",
            body: JSON.stringify({data: dataEncrypted})
        })
    }

    public postMessage()
    {   
        window.parent.postMessage(
            JSON.stringify({
                error: false,
                message: "Hello World",
                score: DataManager.instance.score,
                type: "paypal_modal",
            }),
            "*"
        );
    }

    public postScoreToServer(score: number)
    {
        console.log("End game",score);
        
        let dataEncrypted : string = this.getDataEncrypted({Score: score,TournamentId: this.tournamentId, SkinId: this.skinId});

        fetch(`${this.gameURL}/promotions/store-score-tournament?tournamentId=${this.tournamentId}&skinId=${this.skinId}&cocos=1`,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-refactor-token': this.token,
            },
            method: "POST",
            body: JSON.stringify({data: dataEncrypted})
        })
        .catch(err=>console.log(err));
        
        
        window.parent.postMessage(
            JSON.stringify({
                error: false,
                message: "Hello World",
                score: score + this.currentScore,
                type: "game_tournament",
            }),
            "*"
        );
    }

    private getDataEncrypted(data : any) : string
    {
        return CryptoES.AES.encrypt(JSON.stringify(data),this.key,{
            iv: CryptoES.enc.Utf8.parse('16'),
            mode: CryptoES.mode.CBC,
            padding: CryptoES.pad.Pkcs7
        }).toString();
    }

    public getTicketCanBeMinus()
    {
        let mileStone = JSON.parse(this.mileStone);
        let currentScore = DataManager.instance.score;
        let total = this.calculatingTicketToContinue(mileStone,currentScore);
        return total;
    }

    public canRelive(){
        return this.numberTicket >= this.getTicketCanBeMinus();
    }
}

const ENV_CONFIG = {
    "development" : "http://192.168.1.144:3009/api",
    "staging" : "https://api.play4promote.com/api",
    "production" : "https://api.play4promo.com/api"
}

