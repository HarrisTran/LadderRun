// Created by carolsail
import { ENUM_RESOURCE_TYPE, SCENE_TO_RESOURCES_MAPPING } from './../Enum';
import { IManager } from './IManager';
import PoolManager from './PoolManager';

export default class ResourceManager implements IManager{
    private static readonly PREFAB_PATH: string = "PrefabCocos";
    private static readonly JSON_PATH: string = "Json";
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


    initialize() {
        throw new Error('Method not implemented.');
    }
    progress(): number {
        throw new Error('Method not implemented.');
    }
    initializationCompleted(): boolean {
        throw new Error('Method not implemented.');
    }

    public blockMap = {}

    // public spriteMap = {}

    // public async loadRes(type: ENUM_RESOURCE_TYPE){
    //     return new Promise<void>((resolve, reject)=>{
    //         let resourceType = null
    //         switch(type){
    //             case ENUM_RESOURCE_TYPE.AUDIO:
    //                 resourceType = cc.AudioClip
    //             break
    //             case ENUM_RESOURCE_TYPE.PREFAB:
    //                 resourceType = cc.Prefab
    //             break
    //             case ENUM_RESOURCE_TYPE.SPRITE:
    //                 resourceType = cc.SpriteFrame
    //             break
    //         }
    //         cc.resources.loadDir(type, resourceType, (err, assets)=>{
    //             if(err) reject && reject()
    //             let asset: any
    //             if(type == ENUM_RESOURCE_TYPE.AUDIO){
    //                 for (let i = 0; i < assets.length; i++) {
    //                     asset = assets[i];
    //                     if (!this.clipMap[asset.name]) this.clipMap[asset.name] = asset
    //                 }
    //             }
    //             if(type == ENUM_RESOURCE_TYPE.PREFAB){
    //                 for (let i = 0; i < assets.length; i++) {
    //                     asset = assets[i];
    //                     PoolManager.instance.setPrefab(asset.data.name, asset)
    //                 }
    //             }
    //             if(type == ENUM_RESOURCE_TYPE.SPRITE){
    //                 for (let i = 0; i < assets.length; i++) {
    //                     asset = assets[i];
    //                     if (!this.spriteMap[asset.name]) this.spriteMap[asset.name] = asset
    //                 }
    //             }
    //             resolve && resolve()
    //         })
            
    //     })
    // }

    private _prefabLoadingProgress: number;
    private _prefabLoadingDone: boolean;

    private _jsonLoadingProgress: number;
    private _jsonLoadingDone: boolean;

    public loadResource(){
        this._prefabLoadingProgress = 0;
        this._jsonLoadingProgress = 0;
        this._prefabLoadingDone = false;
        this._jsonLoadingDone = false;
        cc.assetManager.loadBundle(SCENE_TO_RESOURCES_MAPPING[cc.director.getScene().name],(error,bundle)=>{
            bundle.loadDir(ResourceManager.PREFAB_PATH,cc.Prefab,
                (finish,total,item)=>{
                    this._prefabLoadingProgress = finish / total;
                },
                (error,assets)=>{
                    if (error) console.error(error);
                    let asset: any;
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        PoolManager.instance.setPrefab(asset.data.name, asset)
                    }
                    this._prefabLoadingProgress = 1;
                    this._prefabLoadingDone = true;
                }
            )
            bundle.loadDir(ResourceManager.PREFAB_PATH,cc.JsonAsset,
                (finish,total,item)=>{
                    this._jsonLoadingProgress = finish / total;
                },
                (error,assets)=>{
                    if (error) console.error(error);
                    let asset: any;
                    for (let i = 0; i < assets.length; i++) {
                        asset = assets[i];
                        PoolManager.instance.setPrefab(asset.data.name, asset)
                    }
                    this._prefabLoadingProgress = 1;
                    this._prefabLoadingDone = true;
                }
            )
        })
    }

    // public getClip(name: string) {
    //     return this.clipMap[name]
    // }

    // public getSprite(name: string){
    //     return this.spriteMap[name]
    // }
}
