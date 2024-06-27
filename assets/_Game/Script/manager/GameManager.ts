
import { ENUM_GAME_EVENT, ENUM_GAME_ZINDEX, GameState, ENUM_AUDIO_CLIP } from "../Enum";
import Block from '../Block';
import PoolManager from "./PoolManager";
import Player from '../Player';
import Star from '../Star';
import { delay, getNextLastElement, Queue } from '../Utils';
import { IManager } from './IManager';
import ResourceManager from './ResourceManager';
import UIManager from './UIManager';
import AudioManager from './AudioManager';
import { PlayerDataManager } from './PlayerDataManager';
import BEConnector from '../BEConnector';

const { ccclass, property } = cc._decorator;
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


    //@property({ type: cc.Enum(ENUM_GAME_SKIN_CODE) }) public CurrentGameSkin: ENUM_GAME_SKIN_CODE = ENUM_GAME_SKIN_CODE.ALIEN_ASCENT;
    @property(cc.Boolean) enabledConnectWeb: boolean = false;
    @property({ type: cc.Enum(GameState), visible: false }) public CurrentGameState: GameState = GameState.MAIN_MENU;

    @property(UIManager) public UIManager: UIManager = null;
    @property(AudioManager) public audioManager: AudioManager = null;
    @property(cc.Node) private stageNode: cc.Node = null
    @property(cc.Node) public lava: cc.Node = null;
    // @property(cc.Node) private lavaNode: cc.Node = null


    private _allManagers: IManager[] = [];
    public resourcesManager: ResourceManager;
    public playerDataManager: PlayerDataManager;
    public APIManager: BEConnector;

    private _blockQueue: Queue<string> = new Queue<string>();
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
                if (this.isPlayedOnce) {
                    let blockHeight = PoolManager.instance.getNode('block').height;
                    cc.tween(this.lava).by(1, { y: -blockHeight }).start();
                    this.stageNode.getChildByName('player').destroy();

                    let newPosition = cc.v3(this._stayingPosition).addSelf(cc.v3(100, blockHeight));

                    const player: cc.Node = PoolManager.instance.getNode(`player`, this.stageNode, newPosition)
                    player.zIndex = ENUM_GAME_ZINDEX.PLAYER;

                    player.getComponent(Player).setDir(1)
                    player.getComponent(Player).shieldBoosterDuration = 10;

                    this.APIManager.ticketMinus("revive");
                } else {
                    this.initGame()
                    this.APIManager.ticketMinus("auth");
                }
                break;
            case GameState.ENDGAME:
                this.isPlayedOnce = true
                break;
        }
    }

    onLoad() {
        GameManager._instance = this;
        this._initializeGameEvents();
        this.ChangeState(GameState.LOADING);
    }

    private _initializePhysicsManager() {
        const physics = cc.director.getCollisionManager();
        physics.enabled = true;
    }

    private _initializeGameEvents(): void {
        cc.game.on(ENUM_GAME_EVENT.GAME_START, this.onGameStart, this)
        cc.game.on(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin, this)
        cc.game.on(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose, this)
        cc.game.on(ENUM_GAME_EVENT.UPDATE_SCORE, this.updateScore, this);
        cc.game.on(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay, this)
        cc.game.on(ENUM_GAME_EVENT.EFFECT_PICKUP_COIN,this.onEffectPickupCoin,this);
    }

    private _initializeAllManagers(): void {
        this._allManagers = [];

        this.resourcesManager = new ResourceManager();
        this.playerDataManager = new PlayerDataManager();
        this.APIManager = new BEConnector();
        this.APIManager.APIEnable = this.enabledConnectWeb;

        this._allManagers.push(this.resourcesManager);
        this._allManagers.push(this.audioManager);

        this.resourcesManager.initialize();
        this.audioManager.initialize();
        this.APIManager.initialize();

        //SpriteManager.instance.initialize(skinCodeToString[this.CurrentGameSkin]);

        this._initializePhysicsManager();
    }


    private onGameStart() {
        //this.lava.getComponent(Lava).startMove();
        this.audioManager.playSfx(ENUM_AUDIO_CLIP.BUTTON_PLAY);
        this.ChangeState(GameState.PLAYING)
    }

    protected update(dt: number): void {
        if (this.CurrentGameState == GameState.LOADING) {
            let total = this._allManagers.reduce((acc, manager) => {
                return acc + manager.progress();
            }, 0)
            this.UIManager.loadingLayer.setProgressBar(total / this._allManagers.length);
            if (-this._allManagers.every(manager => manager.initializationCompleted()) && this.CurrentGameState == GameState.LOADING) {
                this.ChangeState(GameState.MAIN_MENU);
            }
        }
    }

    private updateScore() {
        if (this.CurrentGameState == GameState.PLAYING) {
            this.UIManager.gameLayer.setGameScore();
        }
    }

    onGameWin() {

    }

    public isStatePlay(): boolean {
        return this.CurrentGameState == GameState.PLAYING;
    }

    // 失败Pp
    onGameLose() {
        this.audioManager.playSfx(ENUM_AUDIO_CLIP.PLAYER_HIT);
        this.ChangeState(GameState.ENDGAME);
    }

    private _initializeBlockQueue() {
        for (let i of this.resourcesManager.levelMap.dequeue()) {
            this._blockQueue.enqueue(i);
        }
    }

    async initGame() {
        if (!this.stageNode) return
        this.stageNode.removeAllChildren()
        const canvasHeight = cc.find('Canvas').height;

        this._initializeBlockQueue();
        //this._initializeBlockQueue();
        
        

        for (let i = 0; i < 6; i++) {
            let block: cc.Node = PoolManager.instance.getNode('block', this.stageNode);
            if (i == 0) {
                block.setPosition(0, (block.height - canvasHeight) / 2);
            } else {
                let offset = (this._previousBlockNode.height + block.height) / 2;
                block.setPosition(0, this._previousBlockNode.y + offset);
            }
            let cpn = block.getComponent(Block);
            let nextID = this._blockQueue.dequeue()
            cpn.init({
                id: 1,
                dataInstance: this.resourcesManager.blockMap[nextID].data
            });
            cpn.rendor();
            block.setSiblingIndex(0);
            this._previousBlockNode = block;
        }
        let firstBlock = getNextLastElement(this.stageNode.children).position.clone();
        await delay(10);
        const player: cc.Node = PoolManager.instance.getNode(`player`, this.stageNode)
        player.zIndex = ENUM_GAME_ZINDEX.PLAYER;
        player.setPosition(firstBlock.addSelf(cc.v3(-200,25)));
        player.getComponent(Player).setDir(1)
        this._stayingPosition = cc.v2(firstBlock);
    }


    onPlayerClimbEnd() {
        let block: cc.Node = PoolManager.instance.getNode('block', this.stageNode);

        let offset = (this._previousBlockNode.height + block.height) / 2;
        block.setPosition(0, this._previousBlockNode.y + offset);

        let cpn = block.getComponent(Block);
        let nextID = this._blockQueue.dequeue()
        
        
        cpn.init({
            id: 1,
            dataInstance: this.resourcesManager.blockMap[nextID].data
        });
        cpn.rendor();
        block.setSiblingIndex(0);
        this._previousBlockNode = block;
        this._stayingPosition.addSelf(new cc.Vec2(0, block.height))

        if (this._blockQueue.size() < 10) {
            this._initializeBlockQueue();
        }

        for(let i = this.stageNode.childrenCount - 1; i >= 0; i--){
            if(this.stageNode.children[i].name == "block" && this._stayingPosition.y > 600){
                cc.tween(this.stageNode.children[i])
                .delay(0.3)
                .removeSelf()
                .start();
                // this.stageNode.children[i].active = false;
                break;
            }
        }

    }

    public getPlayerRelativePosition() {
        let canvasSize = cc.Canvas.instance.designResolution;
        let playerNode = this.stageNode.getChildByName("player")
        if (!playerNode) return;
        let pos = playerNode.getPosition().addSelf(new cc.Vec2(canvasSize.width, canvasSize.height).multiplyScalar(0.5));
        return pos;
    }

    onEffectStarPlay(data: any) {
        const { pos, color, scale } = data
        const star = PoolManager.instance.getNode('star', this.stageNode)
        star.getComponent(Star).init(pos, color, scale)
    }

    onEffectPickupCoin(data: any) {
        const { pos, type} = data
        if (this.CurrentGameState == GameState.PLAYING) {
            if(type == 'coin'){
                this.UIManager.gameLayer.pickUpCoin(pos);
            }
            if(type == 'diamond'){
                this.UIManager.gameLayer.pickUpDiamond(pos);
            }
        }
    }

    protected onDestroy(): void {
        cc.game.off(ENUM_GAME_EVENT.GAME_START, this.onGameStart)
        cc.game.off(ENUM_GAME_EVENT.PLAYER_CLIMB_END, this.onPlayerClimbEnd)
        cc.game.off(ENUM_GAME_EVENT.GAME_WIN, this.onGameWin)
        cc.game.off(ENUM_GAME_EVENT.GAME_LOSE, this.onGameLose)
        cc.game.off(ENUM_GAME_EVENT.EFFECT_STAR_PLAY, this.onEffectStarPlay)
    }

}
