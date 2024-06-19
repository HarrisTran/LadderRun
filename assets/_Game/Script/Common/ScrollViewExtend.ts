
import ItemRow from "../layer/ItemRow";

const {ccclass, property} = cc._decorator;


@ccclass
export default class ScrollViewExtend extends cc.Component{
    @property(cc.ScrollView) scrollView : cc.ScrollView = null;
    @property(cc.Node) topItem: cc.Node = null;
    @property(cc.Node) bottomItem: cc.Node = null;
    @property(cc.SpriteFrame) playerFrame: cc.SpriteFrame = null;

    delta : number = 0;
    playerIndex : number = -1;

    viewHeight: number = 0;

    lowerBound : number = 0;
    upperBound : number = 0;
    private _createCompleted: boolean = false;

    public createBoard(data: number[],playerIndex: number, playerScore: number, itemPrefab: cc.Prefab){
        this.topItem.getComponent(ItemRow).createItemRow(playerIndex, playerScore);
        this.bottomItem.getComponent(ItemRow).createItemRow(playerIndex, playerScore);
        
        this.scrollView.content.removeAllChildren();
        let index : number = 1;
        for(let info of data){
            let item = cc.instantiate(itemPrefab);
            this.scrollView.content.addChild(item);
            item.getComponent(ItemRow).createItemRow(index,info);
            if(index == playerIndex) item.getComponent(cc.Sprite).spriteFrame = this.playerFrame;
            index++;
        }
        this.scrollView.content.getComponent(cc.Layout).updateLayout();
        this.playerIndex = playerIndex;
        this._initializeBoundaries();
        
        this._createCompleted = true;
    }

    protected onDisable(): void {
        this._createCompleted = false;
    }

    private _initializeBoundaries(): void {
        this.viewHeight = this.node.getChildByName('view').height;
        let halfHeightItem = this.scrollView.content.children[0].height/2;

        this.delta = this.scrollView.content.height - this.viewHeight;

        this.lowerBound = (-this.scrollView.content.children[this.playerIndex-1].position.y-this.viewHeight+halfHeightItem)/this.delta;
        this.upperBound = this.lowerBound + this.viewHeight/this.delta;
    }

    private _getRatio(){
        return cc.misc.clamp01(this.scrollView.getContentPosition().y/this.delta);
    }

    protected update(dt: number): void {
        if(this._createCompleted){
            this.topItem.active = false;
            this.bottomItem.active = false;
            if(this.lowerBound > this.viewHeight/this.delta) return;
            if (this._getRatio() > this.upperBound) {
                this.topItem.active = true;
            }
            else if (this._getRatio() < this.lowerBound) {
                this.bottomItem.active = true;
            }
        }
    }
}
