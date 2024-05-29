
import { ISpriteSubcriber } from "./ISpriteSubcriber";
import SpriteManager from "./SpriteManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpriteAdapter extends cc.Sprite implements ISpriteSubcriber {
    private _spriteFrameKey: string = "";

    public get spriteFrameKey(): string { return this._spriteFrameKey; }
    public set spriteFrameKey(value: string) { 
        this._spriteFrameKey = value;
        this.requestSpriteFrame()
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
        throw new Error("Method not implemented.");
    }

    private requestSpriteFrame(){
        this.spriteFrame = SpriteManager.instance.getSpriteFrame(this._spriteFrameKey);
    }


}
