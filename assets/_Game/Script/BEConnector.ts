import * as CryptoES from "crypto-js";
import { IManager } from './manager/IManager';


const {ccclass, property} = cc._decorator;


@ccclass
export default class BEConnector{
    private token: string;
    private skinId: string;
    private tournamentId: string;
    private key: string;
    private deviceInfo : string;

    // Ticket info
    public numberTicket: number;
    public currentScore: number;
    private mileStone: string;

    private _gameScore: number = 0;


    private gameURL: string = '';


    constructor()
    {
        this._gameScore = 0;
        this.getAPInfo();
    }

    public set score(value: number){
        this._gameScore = value;
    }

    public async initialize() {
        try {
            await this.authenticate();
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }
    }

    public getAPInfo(){
        let url = new URLSearchParams(window.location.search);

        this.token = url.get('token');
        this.skinId = url.get('skinId');
        this.tournamentId = url.get('tournamentId');
        this.deviceInfo = url.get('deviceInfo');

        this.numberTicket = parseInt(url.get('numberTicket')) || 0;
        this.currentScore = parseInt(url.get('currentScore')) || 0;
        this.mileStone = url.get('mileStone');
        this.gameURL = ENV_CONFIG[url.get('env')];
    }


    public async requireRankList() {
        await fetch(
            `${this.gameURL}/promotions/detail/${this.tournamentId}`
        ).then(response=>{
            return response.json();
        })
        .then((json)=>{
            console.log(json);
            
        })
    }

    public async authenticate() {
        
        await fetch(
            `${this.gameURL}/promotions/authenticate-tournament?token=${this.token}&tournamentId=${this.tournamentId}&skinId=${this.skinId}&deviceInfo=${this.deviceInfo}`,
        )
            .then((response) => {
                
                if (response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                if (data.ResultCode == 1) this.key = data.Data.Key;
                console.log("Authenticate succeeded");
            })
            .catch(err=>{
                console.log("Authenticate failed");
            })
    }

    public ticketMinus(type: 'auth' | 'revive') {
        let numberTicket = type === 'auth' ? 1 : this.getTicketCanBeMinus();
        let dataEncrypted: string = this._getDataEncrypted({ type: type, total: numberTicket });

        fetch(`${this.gameURL}/promotions/ticket-minus/${this.tournamentId}/${this.skinId}?cocos=1`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-refactor-token': this.token,
            },
            method: 'POST',
            body: JSON.stringify({ data: dataEncrypted }),
        }).then(() => {
            this.numberTicket -= numberTicket;
        });
    }

    public calculatingTicketToContinue(scoreRange: object) {

        let closestMilestone: number = 0;

        for (const milestone in scoreRange) {
            if (parseInt(milestone) <= this._gameScore) {
                closestMilestone = scoreRange[milestone];
            }
        }
        let allValues = Object.keys(scoreRange).map(key =>{
            return scoreRange[key as keyof typeof scoreRange];
        })
        if (!closestMilestone) {
            const minValue = Math.min(...allValues);
            closestMilestone = minValue;
        }
        return closestMilestone;
    }

    public async checkGameScoreTicket() {
        let dataEncrypted : string = this._getDataEncrypted({score: this._gameScore, ticket: this.getTicketCanBeMinus()})

        await fetch(`${this.gameURL}/promotions/check-game-score-ticket/${this.tournamentId}/${this.skinId}?cocos=1`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-access-refactor-token': this.token,
            },
            method: 'POST',
            body: JSON.stringify({ data: dataEncrypted }),
        });
    }

    public postMessage() {
        window.parent.postMessage(
            JSON.stringify({
                error: false,
                message: 'Hello World',
                score: this._gameScore,
                type: 'paypal_modal',
            }),
            '*',
        );
    }

    public postScoreToServer() {
        let dataEncrypted : string = this._getDataEncrypted({Score: this._gameScore,TournamentId: this.tournamentId, SkinId: this.skinId});
    
        fetch(
            `${this.gameURL}/promotions/store-score-tournament?tournamentId=${this.tournamentId}&skinId=${this.skinId}&cocos=1`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-refactor-token': this.token,
                },
                method: 'POST',
                body: JSON.stringify({ data: dataEncrypted }),
            },
        ).catch((err) => console.log(err));

        //this.postScoreWebEvent();
    }

    public postScoreWebEvent(){
        window.parent.postMessage(
            JSON.stringify({
                error: false,
                message: 'Hello World',
                score: this._gameScore + this.currentScore,
                type: 'game_tournament',
            }),
            '*',
        );
    }

    private _getDataEncrypted(data: any): string {
        let result = "";
        try {
            result = CryptoES.AES.encrypt(JSON.stringify(data), this.key, {
                iv: CryptoES.enc.Utf8.parse('16'),
                mode: CryptoES.mode.CBC,
                padding: CryptoES.pad.Pkcs7,
            }).toString();
        } catch (error) {
            console.log(error);
        } 
        return result;
    }

    public getTicketCanBeMinus() {
        return this.calculatingTicketToContinue(JSON.parse(this.mileStone));
    }

    public canRelive() {
        return this.numberTicket >= this.getTicketCanBeMinus();
    }
}

const ENV_CONFIG = {
    development: 'http://192.168.1.144:3009/api',
    staging: 'https://api.play4promote.com/api',
    production: 'https://api.play4promo.com/api',
};

export interface ParticipantInfo {
    id: string,
    totalScore: number
}
