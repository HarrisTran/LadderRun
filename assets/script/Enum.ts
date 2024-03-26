// Created by carolsail 

// 游戏状态
export enum ENUM_GAME_STATUS {
    UNRUNING = 'UNRUNING',
    RUNING = 'RUNING'
}

export const COIN_VALUE = 50;

// 玩家状态
export enum ENUM_PLAYER_STATUS {
    WALK = 'walk',
    CLIMB = 'climb',
    JUMP = 'jump',
    DIE = 'die'
}

// 蝙蝠状态
export enum ENUM_BAT_STATUS {
    IDLE = 'idle',
    FLY = 'fly',
    WALL_IN = 'wall_in',
    WALL_OUT = 'wall_out',
    HIT = 'hit'
}

export enum ENUM_CHICKEN_STATUS {
    IDLE = 'idle',
    RUN = 'run',
    HIT = 'hit'
}

export enum ENUM_PLANT_STATUS {
    IDLE = 'idle',
    ATTACK = 'attack'
}

// 碰撞类型
export enum ENUM_COLLIDER_TAG {
    PLAYER = 0,
    GROUND = 1,
    WALL = 2,
    LADDER = 3,
    ENDPOINT = 4,
    BAT = 5,
    SPIKE = 6,
    BAT_VIEW = 7,
    CHICKEN = 8,
    CHICKEN_VIEW = 9,
    BRICK = 10,
    SAW = 11,
    SPIKEBALL = 12,
    BOX = 13,
    TRAMPOLINE = 14,
    PLANT_VIEW = 15,
    PLANT_BULLET = 16,
    COIN = 17,
    ANANAS = 18,
    MELON = 19,
    PIRANHA_PLANT = 20,
    LAVA = 21,
}

// 事件
export enum ENUM_GAME_EVENT {
    PLAYER_JUMP = 'PLAYER_JUMP',
    PLAYER_CLIMB_END = 'PLAYER_CLIMB_END',
    GAME_START = 'GAME_START',
    GAME_RELIVE = 'GAME_RELIVE',
    GAME_WIN = 'GAME_WIN',
    GAME_LOSE = 'GAME_LOSE',
    CAMERA_MOVE = 'CAMERA_MOVE',
    EFFECT_STAR_PLAY = 'EFFECT_STAR_PLAY',
    GAME_OVER = 'GAME_OVER',
}

// 资源
export enum ENUM_RESOURCE_TYPE {
    AUDIO = 'audio',
    PREFAB = 'prefab',
    SPRITE = 'sprite'
}

// ui层
export enum ENUM_UI_TYPE {
    LOADING,
    MENU,
    GAME,
    LEVEL,
    SETTING,
    LOSE,
    WIN,
    GAME_OVER,
    SKIN,
    MORE,
    CONFIRM,
}

// 音效
export enum ENUM_AUDIO_CLIP {
    BGM = 'bgm_ingame',

    POWER_UP = 'ananas',
    SPEED_UP = 'melon',

    BOX = 'box',
    CLICK = 'button_click',
    PLAY = 'button_play',
    COLLECT = 'coin',

    CHICKEN_HIT = 'chicken_hit',
    CHICKEN_RUN = 'chicken_run',

    BAT_HIT = 'bat_hit',
    BAT_FLY = 'bat_fly',

    PIRANHA_PLANT = 'piranha_plant',

    PLANT_SHOOT = 'plant_shoot',

    DIE = 'player_hit',
    JUMP = 'player_jump',
    CLIMB = 'player_climb',

    SAW = 'saw',

    STONE = 'stone',

    TRAMPOLINE = 'trampoline',
}

// 游戏模式
export enum ENUM_GAME_TYPE {
    LEVEL = 'LEVEL',
    LOOP = 'LOOP'
}

// 场景中节点层级
export enum ENUM_GAME_ZINDEX {
    BLOCK,
    PLAYER 
}