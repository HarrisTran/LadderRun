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

    private _prefabLoadingProgress: number;
    private _prefabLoadingDone: boolean;

    private _jsonLoadingProgress: number;
    private _jsonLoadingDone: boolean;

    public blockMap = {}


    initialize() {
        this.loadResource();
    }
    progress(): number {
        let arr: number[] = [
            this._prefabLoadingProgress,
            this._jsonLoadingProgress,
        ];
        return arr.reduce((t, curr) => t + curr, 0) / arr.length;
    }
    initializationCompleted(): boolean {
        let arr: boolean[] = [
            this._prefabLoadingDone,
            this._jsonLoadingDone,
        ];
        return arr.every(x => x);
    }

    public loadResource(){
        this._prefabLoadingProgress = 0;
        this._jsonLoadingProgress = 0;
        this._prefabLoadingDone = false;
        this._jsonLoadingDone = false;
        cc.assetManager.loadBundle(SCENE_TO_RESOURCES_MAPPING[cc.director.getScene().name],(error,bundle)=>{
            if(error) console.error(error.message);
            
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
            bundle.loadDir(ResourceManager.JSON_PATH,cc.JsonAsset,
                (finish,total,item)=>{
                    this._jsonLoadingProgress = finish / total;
                },
                (error,assets)=>{
                    if (error) console.error(error);
                    for (let i = 0; i < assets.length; i++) {
                        let asset : cc.JsonAsset = assets[i] as any as cc.JsonAsset;
                        this.blockMap[asset.name] = {data: asset.json.data};
                    }
                    this._jsonLoadingProgress = 1;
                    this._jsonLoadingDone = true;
                }
            )
        })
    }

}
