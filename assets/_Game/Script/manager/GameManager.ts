import { StaticInstance } from './../StaticInstance';
// Created by carolsail 

import DataManager from "./DataManager";
import EventManager from "./EventManager";
import { ENUM_GAME_TYPE, ENUM_GAME_EVENT, ENUM_GAME_ZINDEX, ENUM_GAME_STATUS, ENUM_UI_TYPE, GameState, ENUM_AUDIO_CLIP  } from "../Enum";
import {createCycleBlockList, createLevelList} from '../Levels';
import Block from '../Block';
import PoolManager from "./PoolManager";
import Player from '../Player';
import Star from '../Star';
import Lava from '../enemies/Lava';
import { delay, getLastElement, getNextLastElement, Queue } from '../Utils';
import { IManager } from './IManager';
import ResourceManager from './ResourceManager';
import UIManager from './UIManager';
import AudioManager from './AudioManager';
import { PlayerDataManager } from './PlayerDataManager';
import BEConnector from '../BEConnector';

const {ccclass, property} = cc._decorator;
window.addEventListener('message', (data) => {
    const { data: res } = data;
    const objectRes = JSON.parse(res);
    if (objectRes) {
        const { type, value } = objectRes;
        if (type === 'newTicket') {
            GameManager.Instance.APIManager.numberTicket += value;
            GameManager.Instance.ChangeState(GameState.PLAYING);
        }
    }
});
@ccclass
export default class GameManager extends cc.Component {
    private static _instance: GameManager = null;
    public static get Instance(): GameManager {
        return GameManager._instance;
    }

    @property({ type: cc.Enum(GameState) , visible : false}) public CurrentGameState: GameState = GameState.MAIN_MENU;

    @property(UIManager) public UIManager: UIManager = null;
    @property(AudioManager) public audioManager : AudioManager = null;
    @property(cc.Node) private stageNode: cc.Node = null
    @property(cc.Node) public lava: cc.Node = null;
    // @property(cc.Node) private lavaNode: cc.Node = null


    private _allManagers: IManager[] = [];
    public resourcesManager: ResourceManager;
    public playerDataManager: PlayerDataManager;
    public APIManager : BEConnector;

    private _blockQueue : Queue<string> = new Queue<string>();

    private _previousBlockNode: cc.Node;
    private _stayingPosition: cc.Vec2;

    private isPlayedOnce: boolean = false;

    public async ChangeState(newState: GameState) {
        if (this.CurrentGameState == newState) return;
        this.CurrentGameState = newState;  
        this.UIManager.changeState(newState);
        switch (this.CurrentGameState) {
            case GameState.LOADING:
                this._initializeAllManagers();
                break;
            case GameState.MAIN_MENU:
                this.isPlayedOnce = false;
                this.audioManager.playBGM();
                //this.UiController.LoadingDone();
                break;
            case GameState.PLAYING:
                if(this.isPlayedOnce){
                    let lavaPosition = this.lava.getPosition();
                    this.lava.setPosition(lavaPosition.x,lavaPosition.y-1000)
                    //replay
                    const player: cc.Node = PoolManager.instance.getNode(`player`, this.stageNode)
                    player.zIndex = ENUM_GAME_ZINDEX.PLAYER;
                    player.setPosition(this._stayingPosition);
                    player.getComponent(Player).setDir(1) 

                    this.APIManager.ticketMinus("revive");
                }else{
                    this.initGame()
                    this.APIManager.ticketMinus("auth");
                }
                
                // this.UiController.StartGame();
                break;
            // case GameState.REPLAY:
                
            //     const player: cc.Node = PoolManager.instance.getNode(`player`, this.stageNode)
            //     player.zIndex = ENUM_GAME_ZINDEX.PLAYER;
            //     player.setPosition(this._previousBlockNode.position);
            //     player.getComponent(Player).setDir(1)

            //     this.APIManager.ticketMinus("revive");

            //     // this.UiController.StartGame();
            //     break;
            case GameState.ENDGAME:
                this.isPlayedOnce = true
                break;
        }
    }

    onLoad () {
        GameManager._instance = this;
        this._initializeGameEvents();
        this.ChangeState(GameState.LOADING);
    }

    private _initializePhysicsManager(){
        const physics = cc.director.getCollisionManager();
        physics.enabled = true;
    }

    private _initializeGameEvents(): void {
        cc.game.on(ENUM_GAME_EVENT.GAME_START, this.onGameStart, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_RELIVE, this.onGameRelive, this)
        cc.game.on(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose, this)
        cc.game.on(ENUM_GAME_EVENT.UPDATE_SCORE,this.updateScore,this);
        cc.game.on(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_OVER,this.onGameOver,this);
    }

    private _initializeAllManagers(): void {
        this._allManagers = [];

        this.resourcesManager = new ResourceManager();
        this.playerDataManager = new PlayerDataManager();
        this.APIManager = new BEConnector();

        this._allManagers.push(this.resourcesManager);
        this._allManagers.push(this.audioManager);

        this.resourcesManager.initialize();
        this.audioManager.initialize();
        this.APIManager.initialize();

        this._initializePhysicsManager();
        
    }

    private onGameStart(){
        //this.lava.getComponent(Lava).startMove();
        this.audioManager.playSfx(ENUM_AUDIO_CLIP.BUTTON_PLAY);
        this.ChangeState(GameState.PLAYING)
    }

    protected update(dt: number): void {
        if(this.CurrentGameState == GameState.LOADING){
            let total = this._allManagers.reduce((acc,manager)=>{
                return acc + manager.progress();
            },0)
            this.UIManager.loadingLayer.setProgressBar(total/this._allManagers.length);
            if(-this._allManagers.every(manager => manager.initializationCompleted()) && this.CurrentGameState == GameState.LOADING){
                this.ChangeState(GameState.MAIN_MENU);
            }
        }
    }

    private updateScore(){
        if(this.CurrentGameState == GameState.PLAYING){
            
            this.UIManager.setGameScore();
            this.audioManager.playSfx(ENUM_AUDIO_CLIP.COIN);
            this.APIManager.score = this.playerDataManager.getScore();
        }
    }

    // 复活游戏
    onGameRelive(){
        //DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        // DataManager.instance.reset(true)
        //this.initGame();
        // if(!DEBUG_MODE) BackendConnector.instance.ticketMinus("revive")
        // StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE, false);
        // this.scheduleOnce(()=>{
        //     let lavaPosition = this.lavaNode.getPosition();
        //     this.lavaNode.setPosition(lavaPosition.x,lavaPosition.y-400)

        //     let currentIndex = DataManager.instance.currentIndexBlock;
        //     let block = DataManager.instance.blocks[currentIndex-1];
        //     const player: cc.Node = PoolManager.instance.getNode(`player${DataManager.instance.skinIndex}`, this.stageNode)
        //     player.zIndex = ENUM_GAME_ZINDEX.PLAYER
        //     player.setPosition(cc.v2(0, block.y+20))
        //     let playerCmp = player.getComponent(Player);
        //     playerCmp.setDir(1)
        //     playerCmp.awakePowerUp();
        // },0.25)
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
        this.audioManager.playSfx(ENUM_AUDIO_CLIP.PLAYER_HIT);
        this.ChangeState(GameState.ENDGAME);
        // DataManager.instance.status = ENUM_GAME_STATUS.UNRUNING
        // this.scheduleOnce(()=>{
        //     StaticInstance.uiManager.toggle(ENUM_UI_TYPE.LOSE,true)
        // }, 0.5) 
    }

    private _initializeBlockQueue() {
        let blockList = this.resourcesManager.popLevelMap();
        
        for (let i of blockList) {
            this._blockQueue.enqueue(i);
        }
    }

    initGame(){
        if(!this.stageNode) return
        this.stageNode.removeAllChildren()
        const canvasHeight = cc.find('Canvas').height;

        this._initializeBlockQueue();
        this._initializeBlockQueue();

        for (let i = 0; i < 6; i++) {
            let block: cc.Node = PoolManager.instance.getNode('block',this.stageNode);
            if (i == 0) {
                block.setPosition(0,(block.height-canvasHeight)/2);
                this._stayingPosition = new cc.Vec2(0,(block.height-canvasHeight)/2);
            }else{
                let offset = (this._previousBlockNode.height + block.height)/2;
                block.setPosition(0,this._previousBlockNode.y + offset);
            }
            let cpn = block.getComponent(Block);
            cpn.init({
                id : 1,
                dataInstance: this.resourcesManager.blockMap[this._blockQueue.dequeue()].data
            });
            cpn.rendor();
            block.setSiblingIndex(0);
            this._previousBlockNode = block;
        }
        let firstBlock = getNextLastElement(this.stageNode.children).position.clone();
        const player: cc.Node = PoolManager.instance.getNode(`player`, this.stageNode)
        player.zIndex = ENUM_GAME_ZINDEX.PLAYER;
        player.setPosition(firstBlock);
        player.getComponent(Player).setDir(1) 
        
    }


    onPlayerClimbEnd(){
        let block: cc.Node = PoolManager.instance.getNode('block', this.stageNode);
        
        let offset = (this._previousBlockNode.height + block.height) / 2;
        block.setPosition(0, this._previousBlockNode.y + offset);
        
        let cpn = block.getComponent(Block);
        cpn.init({
            id: 1,
            dataInstance: this.resourcesManager.blockMap[this._blockQueue.dequeue()].data
        });
        cpn.rendor();
        block.setSiblingIndex(0);
        this._previousBlockNode = block;
        this._stayingPosition.addSelf(new cc.Vec2(0,block.height))

        if(this._blockQueue.size() < 10){
            this._initializeBlockQueue();
        }
        // let currentIndexBlock = ++DataManager.instance.currentIndexBlock;
        // if(currentIndexBlock>=6)
        // {
        //     if(currentIndexBlock % 10 == 0) {
        //         DataManager.instance.score += Math.round(currentIndexBlock/10)*100;
        //         DataManager.instance.save()
        //         // StaticInstance.uiManager.setGameScore()
        //         // this._levelList = createCycleBlockList();
        //     }
        //     if(currentIndexBlock % 12 == 1){
        //         this._levelList = createCycleBlockList();
        //     }
        // }
        
        // this.addNewBlock(this._levelList[(currentIndexBlock-2)%12]);
    }

    addData(){

        // DataManager.instance.lastIndexBlock = blockIndex;
        // const block: cc.Node = PoolManager.instance.getNode(`block${blockIndex}`, this.stageNode)
        // block.setSiblingIndex(0);
        // const lastBlock = DataManager.instance.getLastBlock()
        // const ladderCurrent: cc.Node = block.getChildByName('ladder')
        // const ladderLast: cc.Node = lastBlock.node.getChildByName('ladder')
        // if(ladderCurrent && ladderLast && ladderCurrent.x == ladderLast.x){
        //     block.getComponent(Block).flipXHelper();
        // }

        // const component = block.getComponent(Block)

        // component.init({
        //     id: lastBlock.id + 1,
        //     x: 0,
        //     y: lastBlock.y + lastBlock.node.height
        // })
        // component.rendor()
    }

    public getPlayerRelativePosition(){
        let canvasSize = cc.Canvas.instance.designResolution;
        let playerNode = this.stageNode.getChildByName("player")
        if(!playerNode) return;
        let pos = playerNode.getPosition().addSelf(new cc.Vec2(canvasSize.width,canvasSize.height).multiplyScalar(0.5));
        return pos;
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
