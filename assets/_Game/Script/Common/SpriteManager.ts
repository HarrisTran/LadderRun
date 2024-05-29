import { IManager } from "../manager/IManager";
import ResourceManager from "../manager/ResourceManager";
import { ISpriteSubcriber } from "./ISpriteSubcriber";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpriteManager implements IManager {
    private static _instance : SpriteManager;

    public static get instance(): SpriteManager {
        if (!this._instance) {
            this._instance = new SpriteManager()
        }
        return this._instance;
    }
    private static SPRITE_BANK_PATH = 'Sprites'

    private _currentSkin: string;
    private _spriteBank: Record<string,cc.SpriteFrame>;
    private _initialized: boolean = false;
    private _loadProgress: number;
    private _subcribers: Set<ISpriteSubcriber> = new Set<ISpriteSubcriber>();

    initialize() {
        this.setSkin(this._currentSkin);
        this._initialized = true;
    }
    progress(): number {
        return this._loadProgress;
    }

    initializationCompleted(): boolean {
        return this._initialized
    }

    public getSpriteFrame(key : string) : cc.SpriteFrame {
        let obj = this._spriteBank[key];
        if(obj){
            return obj;
        }
        return null;
    }

    public subcribe(sub: ISpriteSubcriber){
        this._subcribers.add(sub);
    }

    public unsubcribe(sub: ISpriteSubcriber){
        this._subcribers.delete(sub);
    }

    private _loadSpriteBank() {
        this._loadProgress = 0;
        this._initialized = false;
        this._spriteBank = null;
        cc.resources.loadDir<cc.SpriteFrame>(SpriteManager.SPRITE_BANK_PATH + "/" + this._currentSkin, cc.SpriteFrame, (finish, total, item) => {
            this._loadProgress = finish / total;
        },
            (err, assets) => {
                if(err){
                    console.error(err);
                }
                else{
                    assets.forEach(element => {
                        this._spriteBank[element.name] = element;
                    });
                }
                this._loadProgress = 1;
                this._initialized = true;
                this.notifyChange();
            }
        )
    }

    setSkin(skin: string){
        this._currentSkin = skin;

        this._loadSpriteBank();
    }

    private notifyChange(){
        this._subcribers.forEach(sub => sub.notifyChangeSprite());
    }



}
