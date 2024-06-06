// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ScrollViewExtend extends cc.Component{
    @property(cc.ScrollView) scrollView : cc.ScrollView = null;
    @property(cc.Node) topItem: cc.Node = null;
    @property(cc.Node) bottomItem: cc.Node = null;

    delta : number = 0;
    indexTest = 12;

    lowerBound : number = 0;
    upperBound : number = 0;

    protected onLoad(): void {
        this.delta = this.scrollView.content.height - this.node.getChildByName('view').height;
        this.lowerBound = 0.075*this.indexTest-0.425
        this.upperBound = this.lowerBound + (this.node.getChildByName('view').height)/this.delta;
    }

    private getRatio(){
        return cc.misc.clamp01(this.scrollView.getContentPosition().y/this.delta);
    }

    protected update(dt: number): void {
        this.topItem.active = false;
        this.bottomItem.active = false;
        if(this.getRatio() > this.upperBound){
            this.topItem.active = true;
        }
        else if(this.getRatio() < this.lowerBound){
            this.bottomItem.active = true;
        }
        
    }
}
