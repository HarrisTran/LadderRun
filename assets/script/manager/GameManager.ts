import { StaticInstance } from './../StaticInstance';
// Created by carolsail 

import DataManager from "./DataManager";
import EventManager from "./EventManager";
import { ENUM_GAME_TYPE, ENUM_GAME_EVENT, ENUM_GAME_ZINDEX, ENUM_GAME_STATUS, ENUM_UI_TYPE  } from "../Enum";
import { random } from "../Utils";
import { levels } from '../Levels';
import Block from '../Block';
import PoolManager from "./PoolManager";
import Player from '../Player';
import Star from '../Star';
import SdkManager from './SdkManager';

const {ccclass, property} = cc._decorator;

const BLOCK_NUM = 20

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    stageNode: cc.Node = null

    onLoad () {
        // 注册事件
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_START, this.onGameStart, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_RELIVE, this.onGameRelive, this)
        EventManager.instance.on(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin, this)
        EventManager.instance.on(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose, this)
        EventManager.instance.on(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay, this)
    }

    // 开始游戏
    onGameStart(){
        DataManager.instance.reset()
        this.initGame()
    }

    // 复活游戏
    onGameRelive(){
        DataManager.instance.reset(true)
        this.initGame()
    }

    // 过关
    onGameWin(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        let maxLevel = DataManager.instance.level + 1
        if(maxLevel > levels.length) maxLevel = levels.length
        // 当前关卡
        DataManager.instance.level = maxLevel
        DataManager.instance.save()
        // 解锁关卡
        if(maxLevel > DataManager.instance.unlock){
            DataManager.instance.unlock = maxLevel
            DataManager.instance.save()
        }
        this.setMaxGoal()
        this.scheduleOnce(()=>{
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.WIN)
        }, 0.5)
    }

    // 失败
    onGameLose(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        this.setMaxGoal()
        this.scheduleOnce(()=>{
            StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE)
        }, 0.5) 
    }

    // 初始化游戏
    initGame(){
        if(!this.stageNode) return
        this.stageNode.removeAllChildren()
        // 生成block
        let index = random(0, levels.length - 1)
        if(DataManager.instance.type == ENUM_GAME_TYPE.LEVEL) index = DataManager.instance.level - 1
        const data = levels[index]
        for(let i = 0; i < data.length; i++){
            const blockIndex = data[i]
            const block: cc.Node = PoolManager.instance.getNode(`block${blockIndex}`, this.stageNode)
            if(DataManager.instance.type == ENUM_GAME_TYPE.LEVEL) {
                // 关卡模式不需要金币收集
                block.children.forEach(item=>{
                    if(item.active) item.active = item.name !== 'coin'
                })
            }
            const component = block.getComponent(Block)
            component.init({ id: i + 1, x: 0, y: block.height * i})
            component.rendor()
        }
        // 关卡模式中，最后一个块梯子替换为终点旗子
        if(DataManager.instance.type == ENUM_GAME_TYPE.LEVEL){
            const lastBlock = DataManager.instance.getLastBlock()
            const ladder = lastBlock.node.getChildByName('ladder')
            if(ladder) {
                // 隐藏梯子
                ladder.active = false
                // 显示终点
                const endpoint: cc.Node = PoolManager.instance.getNode(`endpoint`, this.stageNode)
                endpoint.y = (endpoint.height / 2 - (lastBlock.node.height / 2 - 50)) + lastBlock.y - 5
                endpoint.x = ladder.x
            }
        }
        // 生成起点和玩家并对焦摄像机
        const firstBlockNode = DataManager.instance.getFirstBlock()?.node
        if(firstBlockNode){
            // 移动摄像机
            EventManager.instance.emit(ENUM_GAME_EVENT.CAMERA_MOVE, {block: firstBlockNode, reset: true})
            // console.log(111)
            // 角色生成
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
                // console.log(333)
            })
        }
        // console.log(222)
        // 设置ui
        StaticInstance.uiManager.setGameGoal()
        StaticInstance.uiManager.setGameCoins()
        StaticInstance.uiManager.setGameMaxGoal()
        // 游戏初始化完毕
        DataManager.instance.status = ENUM_GAME_STATUS.RUNING
    }

    // 设置楼层最高记录
    setMaxGoal(){
        if(DataManager.instance.goal > DataManager.instance.maxGoal) {
            DataManager.instance.maxGoal = DataManager.instance.goal
            DataManager.instance.save()
            // 设置排行榜
            SdkManager.instance.setRank(DataManager.instance.maxGoal)
        }
    }

    /**
     * 块生成预设规则
     */
    onPlayerClimbEnd(){
        DataManager.instance.goal += 1
        StaticInstance.uiManager.setGameGoal()
        if(DataManager.instance.type == ENUM_GAME_TYPE.LOOP){
            const blockIndex = random(1, BLOCK_NUM)
            const block: cc.Node = PoolManager.instance.getNode(`block${blockIndex}`, this.stageNode)
            const lastBlock = DataManager.instance.getLastBlock()
            const ladderCurrent: cc.Node = block.getChildByName('ladder')
            const ladderLast: cc.Node = lastBlock.node.getChildByName('ladder')
            const bat: cc.Node = block.getChildByName('bat')
            const spikeball: cc.Node = block.getChildByName('spikeball')
            const trampoline: cc.Node = block.getChildByName('trampoline')
            const plant: cc.Node = block.getChildByName('plant')
            // 处理梯子（敌人初始）位置
            if(ladderCurrent.x == ladderLast.x){
                ladderCurrent.x *= -1
                ladderCurrent.scaleX *= -1
                if(bat) bat.x *= -1
                if(spikeball) spikeball.x *= -1
                if(trampoline) trampoline.x *= -1
                if(plant){
                    plant.x *= -1
                    plant.scaleX *= -1
                }
            }
            const component = block.getComponent(Block)
            component.init({
                id: lastBlock.id + 1,
                x: 0,
                y: lastBlock.y + lastBlock.node.height
            })
            component.rendor()
        }
    }

    /**
     * 播放星星效果
     */
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
    }
}
