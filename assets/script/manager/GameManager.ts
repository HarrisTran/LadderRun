import { StaticInstance } from './../StaticInstance';
// Created by carolsail 

import DataManager from "./DataManager";
import EventManager from "./EventManager";
import { ENUM_GAME_TYPE, ENUM_GAME_EVENT, ENUM_GAME_ZINDEX, ENUM_GAME_STATUS, ENUM_UI_TYPE  } from "../Enum";
import {createCycleBlockList, createLevelList} from '../Levels';
import Block from '../Block';
import PoolManager from "./PoolManager";
import Player from '../Player';
import Star from '../Star';
import BackendConnector from '../BackendConnector';
import Lava from '../enemies/Lava';
import { delay } from '../Utils';

const {ccclass, property} = cc._decorator;

export const DEBUG_MODE = false;
// export const DEBUG_MODE = false;
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

    @property(cc.Node)
    lavaNode: cc.Node = null

    @property({type: [cc.Integer]})
    beginLevelForTestGame: number[] = []

    private _levelList : number[] ;

    // private _lowerLevelBound : number;
    // private _upperLevelBound : number;

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
        DataManager.instance.currentIndexBlock = 1;
        DataManager.instance.reset()
        // this._lowerLevelBound = 0;
        // this._upperLevelBound = 0;
        this._levelList = createCycleBlockList()
        this.initGame()
    }

    // 复活游戏
    onGameRelive(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        // DataManager.instance.reset(true)
        //this.initGame();
        if(!DEBUG_MODE) BackendConnector.instance.ticketMinus("revive")
        StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false);
        this.scheduleOnce(()=>{
            let lavaPosition = this.lavaNode.getPosition();
            this.lavaNode.setPosition(lavaPosition.x,lavaPosition.y-400)

            let currentIndex = DataManager.instance.currentIndexBlock;
            let block = DataManager.instance.blocks[currentIndex-1];
            const player: cc.Node = PoolManager.instance.getNode(`player${DataManager.instance.skinIndex}`, this.stageNode)
            player.zIndex = ENUM_GAME_ZINDEX.PLAYER
            player.setPosition(cc.v2(0, block.y+20))
            let playerCmp = player.getComponent(Player);
            playerCmp.setDir(1)
            playerCmp.awakePowerUp();
        },0.25)
    }

    async onGameOver(){
        await delay(1000);
        BackendConnector.instance.postScoreToServer(DataManager.instance.score)
    }

    // 过关
    onGameWin(){
        
    }

    // 失败
    onGameLose(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        this.scheduleOnce(()=>{
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE,true)
        }, 0.5) 
    }

    initGame(){
        if(!this.stageNode) return
        this.stageNode.removeAllChildren()
        this.lavaNode.setPosition(0,-650);
        const data = [26,29,40,27,26,3,36,28,26,33,29,28,31,32]
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
        StaticInstance.uiManager.setGameScore()
        StaticInstance.uiManager.setGameMaxScore()
        //DataManager.instance.status = ENUM_GAME_STATUS.RUNING
    }

    setMaxGoal(){
        if(DataManager.instance.goal > DataManager.instance.maxGoal) {
            DataManager.instance.maxGoal = DataManager.instance.goal
            DataManager.instance.save()
        }
    }

    onPlayerClimbEnd(){
        let currentIndexBlock = ++DataManager.instance.currentIndexBlock;
        if(currentIndexBlock>=6)
        {
            if(currentIndexBlock % 10 == 0) {
                DataManager.instance.score += Math.round(currentIndexBlock/10)*100;
                DataManager.instance.save()
                StaticInstance.uiManager.setGameScore()
                // this._levelList = createCycleBlockList();
            }
            if(currentIndexBlock % 12 == 1){
                this._levelList = createCycleBlockList();
            }
        }
        
        this.addNewBlock(this._levelList[(currentIndexBlock-2)%12]);
    }

    addNewBlock(blockIndex: number){
        DataManager.instance.lastIndexBlock = blockIndex;
        const block: cc.Node = PoolManager.instance.getNode(`block${blockIndex}`, this.stageNode)
        block.setSiblingIndex(0);
        const lastBlock = DataManager.instance.getLastBlock()
        const ladderCurrent: cc.Node = block.getChildByName('ladder')
        const ladderLast: cc.Node = lastBlock.node.getChildByName('ladder')
        if(ladderCurrent && ladderLast && ladderCurrent.x == ladderLast.x){
            block.getComponent(Block).flipXHelper();
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

}
