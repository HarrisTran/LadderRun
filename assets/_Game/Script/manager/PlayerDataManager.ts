export class PlayerDataManager{
    private _score : number;

    constructor(){
        this._score = 0;
    }
    
    public addScore(score: number){
        this._score += score;
    }

    public getScore(){
        return this._score;
    }
}