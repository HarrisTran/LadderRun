
import { ISpriteSubcriber } from "./ISpriteSubcriber";
import SpriteManager from "./SpriteManager";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class SpriteAdapter extends cc.Component implements ISpriteSubcriber {
    @property({type: cc.Sprite, visible: false })
    private sprite: cc.Sprite = null;

    private _spriteFrameKey: string = "";
    
    protected onLoad(): void {
        this.sprite = this.node.getComponent(cc.Sprite)
    }

    protected onEnable(): void 
    {
        if(SpriteManager.instance.initializationCompleted()){
            this.requestSpriteFrame();
        }
        SpriteManager.instance.subcribe(this);
    }

    protected onDisable(): void 
    {
        SpriteManager.instance.unsubcribe(this);
    }

    notifyChangeSprite(): void {
        this.requestSpriteFrame();
    }

    private requestSpriteFrame(){
        if(this.sprite && this.sprite.spriteFrame){
            let spriteFrameName = this.sprite.spriteFrame.name;
            this._spriteFrameKey = spriteFrameName;
            this.sprite.spriteFrame = SpriteManager.instance.getSpriteFrame(this._spriteFrameKey);
        }
    }



}
