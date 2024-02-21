// Created by carolsail
import { ENUM_RESOURCE_TYPE } from './../Enum';
import PoolManager from './PoolManager';

export default class ResourceManager {

    public clipMap = {}

    public spriteMap = {}

    private static _instance: any = null

    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }

        return this._instance
    }

    static get instance() {
        return this.getInstance<ResourceManager>()
    }

    public async loadRes(type: ENUM_RESOURCE_TYPE){
        return new Promise<void>((resolve, reject)=>{
            let resourceType = null
            switch(type){
                case ENUM_RESOURCE_TYPE.AUDIO:
                    resourceType = cc.AudioClip
                break
                case ENUM_RESOURCE_TYPE.PREFAB:
                    resourceType = cc.Prefab
                break
                case ENUM_RESOURCE_TYPE.SPRITE:
                    resourceType = cc.SpriteFrame
                break
            }
            cc.resources.loadDir(type, resourceType, (err, assets)=>{
                if(err) reject && reject()
                let asset: any
                if(type == ENUM_RESOURCE_TYPE.AUDIO){
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        if (!this.clipMap[asset.name]) this.clipMap[asset.name] = asset
                    }
                }
                if(type == ENUM_RESOURCE_TYPE.PREFAB){
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        console.log(asset.data.name);
                        
                        PoolManager.instance.setPrefab(asset.data.name, asset)
                    }
                }
                if(type == ENUM_RESOURCE_TYPE.SPRITE){
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        if (!this.spriteMap[asset.name]) this.spriteMap[asset.name] = asset
                    }
                }
                resolve && resolve()
            })
        })
    }

    public getClip(name: string) {
        return this.clipMap[name]
    }

    public getSprite(name: string){
        return this.spriteMap[name]
    }
}
