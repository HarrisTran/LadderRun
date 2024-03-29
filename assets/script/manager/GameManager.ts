import { StaticInstance } from './../StaticInstance';
// Created by carolsail 

import DataManager from "./DataManager";
import EventManager from "./EventManager";
import { ENUM_GAME_TYPE, ENUM_GAME_EVENT, ENUM_GAME_ZINDEX, ENUM_GAME_STATUS, ENUM_UI_TYPE  } from "../Enum";
import { random } from "../Utils";
import {createLevelList} from '../Levels';
import Block from '../Block';
import PoolManager from "./PoolManager";
import Player from '../Player';
import Star from '../Star';
import BackendConnector from '../BackendConnector';
import Lava from '../enemies/Lava';

const {ccclass, property} = cc._decorator;

export const DEBUG_MODE = true;
window.addEventListener("message", (data) => {
    const { data: res } = data
    const objectRes = JSON.parse(res)
    const { type, value } = objectRes
    if(type === "newTicket") {
        BackendConnector.instance.numberTicket += value
        EventManager.instance.emit(ENUM_GAME_EVENT.GAME_RELIVE)
    }
})

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    stageNode: cc.Node = null

    @property(Lava)
    lavaNode: Lava = null

    private _levelList : number[];
    private _lowerLevelBound : number;
    private _upperLevelBound : number;

    onLoad () {
        // 注册事件
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_START, this.onGameStart, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_RELIVE, this.onGameRelive, this)
        EventManager.instance.on(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose, this)
        EventManager.instance.on(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_OVER,this.onGameOver,this);
    }

    // 开始游戏
    onGameStart(){
        DataManager.instance.reset()
        this._lowerLevelBound = 0;
        this._upperLevelBound = 0;
        this._levelList = createLevelList();
        this.initGame()
    }

    // 复活游戏
    onGameRelive(){
        DataManager.instance.reset(true)
        this.initGame();
        if(!DEBUG_MODE) BackendConnector.instance.ticketMinus("revive")
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false);
    }

    onGameOver(){
        BackendConnector.instance.postScoreToServer(DataManager.instance.coins)
    }

    // 过关
    onGameWin(){
        // DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        // let maxLevel = DataManager.instance.level + 1
        // if(maxLevel > levels.length) maxLevel = levels.length
        // // 当前关卡
        // DataManager.instance.level = maxLevel
        // DataManager.instance.save()
        // // 解锁关卡
        // if(maxLevel > DataManager.instance.unlock){
        //     DataManager.instance.unlock = maxLevel
        //     DataManager.instance.save()
        // }
        // //this.setMaxGoal()
        // this.scheduleOnce(()=>{
        //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.WIN)
        // }, 0.5)
    }

    // 失败
    onGameLose(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        this.scheduleOnce(()=>{
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE)
        }, 0.5) 
    }

    initGame(){
        if(!this.stageNode) return
        this.stageNode.removeAllChildren()
        this.lavaNode.node.setPosition(0,-650);
        const data = [1,2,3,4,5,6,7,8,9]//createLevelDesign(5,6,10)
        for(let i = 0; i < data.length; i++){
            const blockIndex = data[i]
            const block: cc.Node = PoolManager.instance.getNode(`block${blockIndex}`, this.stageNode)
            const component = block.getComponent(Block)
            component.init({ id: i + 1, x: 0, y: block.height * i})
            component.rendor()
            block.setSiblingIndex(0)
            if(i%2){
                component.flipXHelper()
            }
        }
        const firstBlockNode = DataManager.instance.getFirstBlock()?.node
        if(firstBlockNode){
            EventManager.instance.emit(ENUM_GAME_EVENT.CAMERA_MOVE, {block: firstBlockNode, reset: true})
            this.scheduleOnce(()=>{
                const ladder = firstBlockNode.getChildByName('ladder')
                const player: cc.Node = PoolManager.instance.getNode(`player${DataManager.instance.skinIndex}`, this.stageNode)
                player.zIndex = ENUM_GAME_ZINDEX.PLAYER
                player.setPosition(cc.v2(-ladder.x, firstBlockNode.y))
                if(ladder.x > 0){
                    player.getComponent(Player).setDir(1)
                }else{
                    player.getComponent(Player).setDir(-1)
                }
            })
        }
        StaticInstance.uiManager.setGameGoal()
        StaticInstance.uiManager.setGameCoins()
        StaticInstance.uiManager.setGameMaxScore()
        DataManager.instance.status = ENUM_GAME_STATUS.RUNING
    }

    setMaxGoal(){
        if(DataManager.instance.goal > DataManager.instance.maxGoal) {
            DataManager.instance.maxGoal = DataManager.instance.goal
            DataManager.instance.save()
        }
    }

    onPlayerClimbEnd(){
        DataManager.instance.goal += 1
        StaticInstance.uiManager.setGameGoal()
        if(DataManager.instance.type == ENUM_GAME_TYPE.LOOP){
            let newBlockIndex = this.getRandomBlockIndex();
            this.addNewBlock(newBlockIndex);
        }
    }

    addNewBlock(blockIndex: number){
        DataManager.instance.lastIndexBlock = blockIndex;
        const block: cc.Node = PoolManager.instance.getNode(`block${blockIndex}`, this.stageNode)
        block.setSiblingIndex(0);
        const lastBlock = DataManager.instance.getLastBlock()
        const ladderCurrent: cc.Node = block.getChildByName('ladder')
        const ladderLast: cc.Node = lastBlock.node.getChildByName('ladder')
        // const bat: cc.Node = block.getChildByName('bat')
        // const spikeball: cc.Node = block.getChildByName('spikeball')
        // const trampoline: cc.Node = block.getChildByName('trampoline')
        // const plant: cc.Node = block.getChildByName('plant')
        // const brick: cc.Node = block.getChildByName('brick')
        if(ladderCurrent && ladderLast && ladderCurrent.x == ladderLast.x){
            block.getComponent(Block).flipXHelper();
            // ladderCurrent.x *= -1
            // ladderCurrent.scaleX *= -1
            // if(bat) bat.x *= -1
            // if(spikeball) spikeball.x *= -1
            // if(trampoline) trampoline.x *= -1
            // if(plant){
            //     plant.x *= -1
            //     plant.scaleX *= -1
            // }
            // if(brick) brick.x *= -1
        }

        const component = block.getComponent(Block)

        component.init({
            id: lastBlock.id + 1,
            x: 0,
            y: lastBlock.y + lastBlock.node.height
        })
        component.rendor()
    }

    onEffectStarPlay(data: any){
        const {pos, color, scale} = data
        const star = PoolManager.instance.getNode('star', this.stageNode)
        star.getComponent(Star).init(pos, color, scale)
    }

    protected onDestroy(): void {
        EventManager.instance.off(ENUM_GAME_EVENT.GAME_START, this.onGameStart)
        EventManager.instance.off(ENUM_GAME_EVENT.GAME_RELIVE, this.onGameRelive)
        EventManager.instance.off(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd)
        EventManager.instance.off(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin)
        EventManager.instance.off(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose)
        EventManager.instance.off(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay)
        EventManager.instance.off(ENUM_GAME_EVENT.GAME_OVER,this.onGameOver);
    }

    private getRandomBlockIndex() {
        if (this._upperLevelBound < this._levelList.length) {
            this._upperLevelBound++;
        }
        else {
            if (this._upperLevelBound < this._levelList.length - 5) {
                this._lowerLevelBound++;
            }
        }
        return this._levelList[random(this._lowerLevelBound, this._upperLevelBound)];
    }

}
