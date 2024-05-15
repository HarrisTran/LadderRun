// Created by carolsail 
 
import Block from '../Block'; 
import { ENUM_GAME_STATUS, ENUM_GAME_TYPE } from '../Enum'; 
const STORAGE_KEY = 'STAIRWAY_STORAGE_KEY' 
 
export default class DataManager { 
 
    private static _instance: any = null 
 
    static getInstance<T>(): T { 
        if (this._instance === null) { 
            this._instance = new this() 
        } 
 
        return this._instance 
    } 
 
    static get instance() { 
        return this.getInstance<DataManager>() 
    } 
 
    public lastIndexBlock: number = 0; 
    public isReplayed : boolean = false; 
    public currentIndexBlock: number = 0; 
    // 游戏模式 
    type: ENUM_GAME_TYPE = ENUM_GAME_TYPE.LOOP 
    // 游戏状态 
    status: ENUM_GAME_STATUS = ENUM_GAME_STATUS.UNRUNING 
    // 当前关卡 
    _level: number = 1 
    // 解锁关卡 
    _unlock: number = 1 
    // 声音开启 
    _isMusicOn: boolean = true 
    _isSoundOn: boolean = true 
    // 最好战绩 
    _maxGoal: number = 1 
    // 收集金币 
    _coins: number = 0 
    _score: number = 0 
    // 皮肤 
    _skinIndex: number = 0 
 
    //_currentFloor: number = 0; 
    // 皮肤锁定信息 
    skinLockInfo: any[] = [ 
        {locked: false, coins: 0}, 
        {locked: true, coins: 50}, 
        {locked: true, coins: 100}, 
        {locked: true, coins: 200}, 
        {locked: true, coins: 500} 
    ] 
    // 得分 
    goal: number = 1 
    // block 
    blocks: Block[] = [] 
    // 更多游戏 
    games: any[] = [ 
    ] 
 
    _gamedata : any = {}; 
 
    get level(){ 
        return this._level 
    } 
 
    set level(data: number){ 
        this._level = data 
    } 
 
    get unlock(){ 
        return this._unlock 
    } 
 
    set unlock(data: number){ 
        this._unlock = data 
    } 
 
    get isMusicOn(){ 
        return this._isMusicOn 
    } 
 
    set isMusicOn(data: boolean){ 
        this._isMusicOn = data 
    } 
 
    get isSoundOn(){ 
        return this._isSoundOn 
    } 
 
    set isSoundOn(data: boolean){ 
        this._isSoundOn = data 
    } 
 
    get maxGoal(){ 
        return this._maxGoal 
    } 
 
    set maxGoal(data: number){ 
        this._maxGoal = data 
    } 
 
    get coins(){ 
        return this._coins 
    } 
 
    set coins(data: number){ 
        this._coins = data 
    } 
 
    get score(){ 
        return this._score 
    } 
 
    set score(data: number){ 
        this._score = data 
    } 
 
    get skinIndex(){ 
        return this._skinIndex 
    } 
 
    set skinIndex(data: number){ 
        this._skinIndex = data 
    } 
     
    setSkinLockInfo(index: number, locked: boolean){ 
        this.skinLockInfo[index]['locked'] = locked 
        this.save() 
    } 
 
    reset(keepGoal: boolean = false){ 
        this.status = ENUM_GAME_STATUS.UNRUNING 
        this.blocks = [] 
        if(!keepGoal) this.goal = 1 
    } 
 
 
    save(){ 
        this._gamedata = { 
            level: this.level, 
            unlock: this.unlock, 
            isSoundOn: this.isSoundOn, 
            isMusicOn: this.isMusicOn, 
            maxGoal: this.maxGoal, 
            coins: this.coins, 
            score: this.score, 
            skinIndex: this.skinIndex, 
            skinLockInfo: this.skinLockInfo, 
        } 
    } 
 
    restore(){ 
        this.level = 1 
        this.unlock = 1 
        this.isMusicOn = true 
        this.isSoundOn = true 
        this.maxGoal = 1 
        this.coins = 0 
        this.score = 0 
        this.skinIndex = 0 
        this.reset()
    } 
 
    getLastBlock(){ 
        if(this.blocks.length <= 0) return null 
        return this.blocks[this.blocks.length - 1] 
    } 
 
    getFirstBlock(){ 
        if(this.blocks.length <= 0) return null 
        return this.blocks[0] 
    } 
 
    getBlockIndex(ith: number) 
    { 
        if(this.blocks.length <= 0) return null; 
        return this.blocks[ith]; 
    } 
 
}
