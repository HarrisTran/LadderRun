
const {ccclass, property} = cc._decorator;

@ccclass
export default class IncreaseNumber extends cc.Label {

    private _label : cc.Label = null;
    private _incrementTween : cc.Tween = null;

    protected onLoad(): void {
        this._label = this.node.getComponent(cc.Label);
        this._label.string = '0';
    }

    public playTween(timelapse: number, goal: number)
    {
        this._incrementTween = cc.tween(this.node)
        .to(timelapse,{opacity:255},{progress: (_0: number, _1: number,_2:number,ratio:number)=>{
            this._label.string = Math.round(goal * ratio).toString();
        }})

        return this._incrementTween;
    }
}
