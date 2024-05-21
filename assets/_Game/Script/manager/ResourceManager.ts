// Created by carolsail
import { Queue } from '../Utils';
import { ENUM_RESOURCE_TYPE, SCENE_TO_RESOURCES_MAPPING } from './../Enum';
import { IManager } from './IManager';
import PoolManager from './PoolManager';

export default class ResourceManager implements IManager{
    private static readonly COMMON_RESOURCES : string = "CommonResources";
    private static readonly PREFAB_PATH: string = "PrefabCocos";
    private static readonly BLOCK_JSON_PATH: string = "Json/Block";
    private static readonly LEVEL_JSON_PATH: string = "Json/Level";
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

    private _blockJsonLoadingProgress: number;
    private _blockJsonLoadingDone: boolean;

    private _levelJsonLoadingProgress: number;
    private _levelJsonLoadingDone: boolean;

    public blockMap = {}
    public levelMap : Queue<string[]> = new Queue<string[]>();


    initialize() {
        this.loadResource();
    }
    progress(): number {
        let arr: number[] = [
            this._prefabLoadingProgress,
            this._blockJsonLoadingProgress,
            this._levelJsonLoadingProgress
        ];
        return arr.reduce((t, curr) => t + curr, 0) / arr.length;
    }
    initializationCompleted(): boolean {
        let arr: boolean[] = [
            this._prefabLoadingDone,
            this._blockJsonLoadingDone,
            this._levelJsonLoadingDone,
        ];
        return arr.every(x => x);
    }

    public loadResource(){

        this._prefabLoadingProgress = 0;
        this._blockJsonLoadingProgress = 0;
        this._levelJsonLoadingProgress = 0;

        this._prefabLoadingDone = false;
        this._blockJsonLoadingDone = false;
        this._levelJsonLoadingDone = false;

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
        })

        cc.assetManager.loadBundle(ResourceManager.COMMON_RESOURCES,(error,bundle)=>{
            if(error) console.error(error.message);

            bundle.loadDir(ResourceManager.BLOCK_JSON_PATH,cc.JsonAsset,
                (finish,total,item)=>{
                    this._blockJsonLoadingProgress = finish / total;
                },
                (error,assets)=>{
                    if (error) console.error(error);
                    for (let i = 0; i < assets.length; i++) {
                        let asset : cc.JsonAsset = assets[i] as any as cc.JsonAsset;
                        this.blockMap[asset.name] = {data: asset.json.data};
                    }
                    this._blockJsonLoadingProgress = 1;
                    this._blockJsonLoadingDone = true;
                }
            )

            bundle.loadDir(ResourceManager.LEVEL_JSON_PATH,cc.JsonAsset,
                (finish,total,item)=>{
                    this._levelJsonLoadingProgress = finish / total;
                },
                (error,assets)=>{
                    if (error) console.error(error);
                    for (let i = 0; i < assets.length; i++) {
                        let asset : cc.JsonAsset = assets[i] as any as cc.JsonAsset;
                        this.levelMap.enqueue(asset.json.data);
                    }
                    this._levelJsonLoadingProgress = 1;
                    this._levelJsonLoadingDone = true;
                }
            )
        })
    }

    public popLevelMap(){
        return this.levelMap.dequeue();
    }

}
