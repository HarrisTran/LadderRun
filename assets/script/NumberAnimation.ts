
const { ccclass, property } = cc._decorator;

@ccclass
export default class NumberAnimation extends cc.Label {

    private _incrementTween: cc.Tween = null;
    
    public playLinearIncrease(timelapse: number, goal: number) {
        this._incrementTween = cc.tween(this.node)
            .to(timelapse, { opacity: 255 }, {
                progress: (_0: number, _1: number, _2: number, ratio: number) => {
                    this.string = Math.round(goal * ratio).toString();
                }
            })
        return this._incrementTween;
    }


    public playDiscreteResize(currentScore: number,cb?: ()=>void){
        return new Promise((resolve) => {
            cc.tween(this.node)
            .to(0.3,{scale: 1.2})
            .call(()=>{
                cb();
            })
            .to(0.2,{scale: 1})
            .call(()=>{
                this.string = `${currentScore - 50}`;
                resolve("resolve");
            })
            .start();
        })
    }
}
