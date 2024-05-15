import { StaticInstance } from './../StaticInstance';
// Created by carolsail 

import DataManager from "./DataManager";
import EventManager from "./EventManager";
import { ENUM_GAME_TYPE, ENUM_GAME_EVENT, ENUM_GAME_ZINDEX, ENUM_GAME_STATUS, ENUM_UI_TYPE, GameState  } from "../Enum";
import {createCycleBlockList, createLevelList} from '../Levels';
import Block from '../Block';
import PoolManager from "./PoolManager";
import Player from '../Player';
import Star from '../Star';
import BackendConnector from '../BackendConnector';
import Lava from '../enemies/Lava';
import { delay } from '../Utils';
import { IManager } from './IManager';
import ResourceManager from './ResourceManager';
import UIManager from './UIManager';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    private static _instance: GameManager = null;
    public static get Instance(): GameManager {
        return GameManager._instance;
    }

    @property({ type: cc.Enum(GameState) , visible : false}) public CurrentGameState: GameState = GameState.MainMenu;

    @property(UIManager) public UIManager: UIManager = null;
    @property(cc.Node) private stageNode: cc.Node = null
    // @property(cc.Node) private lavaNode: cc.Node = null


    private _allManagers: IManager[] = [];
    public resourcesManager: ResourceManager;

    private _levelList : number[] ;

    onLoad () {
        GameManager._instance = this;
        this._initializeGameEvents();
        this.ChangeState(GameState.Loading);
    }

    private _initializeGameEvents(): void {
        cc.game.on(ENUM_GAME_EVENT.GAME_START, this.onGameStart, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_RELIVE, this.onGameRelive, this)
        cc.game.on(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose, this)
        cc.game.on(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_OVER,this.onGameOver,this);
    }


    public async ChangeState(newState: GameState) {
        if (this.CurrentGameState == newState) return;

        this.CurrentGameState = newState;  
        switch (this.CurrentGameState) {
            case GameState.Loading:
                this._initializeAllManagers();
                break;
            case GameState.MainMenu:
                //this.UiController.LoadingDone();
                break;
            case GameState.Playing:
                // this.APIManager.ticketMinus("auth");
                // this.UiController.StartGame();
                break;
            case GameState.Replay:
                // this.APIManager.ticketMinus("revive");
                // this.UiController.StartGame();
                break;
            case GameState.EndGame:
                // this.UiController.ShowEndGameUI();
                break;
        }
    }

    private _initializeAllManagers(): void {
        this._allManagers = [];

        this.resourcesManager = new ResourceManager();

        this._allManagers.push(this.resourcesManager);

        this.resourcesManager.initialize();
    }

    onGameStart(){
        // DataManager.instance.currentIndexBlock = 1;
        // DataManager.instance.reset()
        // // this._lowerLevelBound = 0;
        // // this._upperLevelBound = 0;
        // this._levelList = createCycleBlockList()
        this.initGame()
    }

    protected update(dt: number): void {
        if(this.CurrentGameState == GameState.Loading){
            let total = this._allManagers.reduce((acc,manager)=>{
                return acc + manager.progress();
            },0)
            this.UIManager.loadingLayer.setProgressBar(total/this._allManagers.length);
            if(-this._allManagers.every(manager => manager.initializationCompleted()) && this.CurrentGameState == GameState.Loading){
                this.ChangeState(GameState.MainMenu);
            }
        }
    }

    // 复活游戏
    onGameRelive(){
        DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        // DataManager.instance.reset(true)
        //this.initGame();
        // if(!DEBUG_MODE) BackendConnector.instance.ticketMinus("revive")
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
        // BackendConnector.instance.postScoreToServer(DataManager.instance.score)
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
        // this.lavaNode.setPosition(0,-650);
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
        cc.game.off(ENUM_GAME_EVENT.GAME_START, this.onGameStart)
        cc.game.off(ENUM_GAME_EVENT.GAME_RELIVE, this.onGameRelive)
        cc.game.off(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd)
        cc.game.off(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin)
        cc.game.off(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose)
        cc.game.off(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay)
        cc.game.off(ENUM_GAME_EVENT.GAME_OVER,this.onGameOver);
    }

}
