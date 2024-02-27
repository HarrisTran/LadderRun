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
    // 皮肤
    _skinIndex: number = 0

    _currentFloor: number = 0;
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
        // {title: '消了个消3d', icon: 'xiao3d', appid: 'wx5841e5a26082b380', url: 'https://store.cocos.com/app/detail/4148'},
        // {title: '实况足球杯', icon: 'football', appid: 'wx0c16e9d7f9e87dac', url: 'https://store.cocos.com/app/detail/4221'},
        // {title: '消了个消2d', icon: 'xiao2d', appid: 'wxefd5a4ddd8e31b44', url: 'https://store.cocos.com/app/detail/4183'},
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

    get skinIndex(){
        return this._skinIndex
    }

    set skinIndex(data: number){
        this._skinIndex = data
    }

    get currentFloor(){
        return this._currentFloor
    }

    set currentFloor(data: number){
        this._currentFloor = data
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

    revive(){
        this.status = ENUM_GAME_STATUS.UNRUNING
    }

    save(){
        this._gamedata = {
            level: this.level,
            unlock: this.unlock,
            isSoundOn: this.isSoundOn,
            isMusicOn: this.isMusicOn,
            maxGoal: this.maxGoal,
            coins: this.coins,
            skinIndex: this.skinIndex,
            skinLockInfo: this.skinLockInfo,
            currentFloor: this.currentFloor
        }
        // cc.sys.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        //     level: this.level,
        //     unlock: this.unlock,
        //     isSoundOn: this.isSoundOn,
        //     isMusicOn: this.isMusicOn,
        //     maxGoal: this.maxGoal,
        //     coins: this.coins,
        //     skinIndex: this.skinIndex,
        //     skinLockInfo: this.skinLockInfo
        // }))
    }

    restore(){
        this.level = 1
        this.unlock = 1
        this.isMusicOn = true
        this.isSoundOn = true
        this.maxGoal = 1
        this.coins = 0
        this.skinIndex = 0
        this.currentFloor = 1;
        this.reset()
        // const _data = cc.sys.localStorage.getItem(STORAGE_KEY) as any
        // try {
        //     const data = JSON.parse(_data)
        //     this.level = data?.level || 1
        //     this.unlock = data?.unlock || 1
        //     this.isMusicOn = data?.isMusicOn === false ? false : true
        //     this.isSoundOn = data?.isSoundOn === false ? false : true
        //     this.maxGoal = data?.maxGoal || 1
        //     this.coins = data?.coins || 0
        //     this.skinIndex = data?.skinIndex || 0
        //     if(data.skinLockInfo) this.skinLockInfo = data.skinLockInfo
        //     DataManager.instance.save()
        // } catch {
        //     this.level = 1
        //     this.unlock = 1
        //     this.isMusicOn = true
        //     this.isSoundOn = true
        //     this.maxGoal = 1
        //     this.coins = 0
        //     this.skinIndex = 0
        //     this.reset()
        // }
    }

    getLastBlock(){
        if(this.blocks.length <= 0) return null
        return this.blocks[this.blocks.length - 1]
    }

    getFirstBlock(){
        if(this.blocks.length <= 0) return null
        return this.blocks[0]
    }

}
