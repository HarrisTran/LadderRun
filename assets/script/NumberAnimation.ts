
const { ccclass, property } = cc._decorator;

@ccclass
export default class NumberAnimation extends cc.Label {

    private _isPlayed : boolean = false;
    private _goal : number = 0;
    
    public playLinearIncrease(goal: number) {
        this._isPlayed = true;
        this._goal = goal;
    }

}
