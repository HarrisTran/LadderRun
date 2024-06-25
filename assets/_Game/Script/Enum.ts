export enum ENUM_GAME_SKIN_CODE {
    ALIEN_ASCENT = 1,
    CASTLE_ESCAPE,
    PYRAMID_PANIC, 
    ZOMBIE_BREAK,
}

export const skinCodeToString: Record<ENUM_GAME_SKIN_CODE, string> = {
    [ENUM_GAME_SKIN_CODE.ALIEN_ASCENT]: "Alien Ascent",
    [ENUM_GAME_SKIN_CODE.CASTLE_ESCAPE]: "Castle Escape",
    [ENUM_GAME_SKIN_CODE.PYRAMID_PANIC]: "Pyramid Panic",
    [ENUM_GAME_SKIN_CODE.ZOMBIE_BREAK]: "Zombie Break",
};


export enum GameState {
    LOADING,
    MAIN_MENU,
    PLAYING,
    //REPLAY,
    ENDGAME
}

export const SCENE_TO_RESOURCES_MAPPING : {[key:string]:string} = {
    'Alien Theme' : 'Alien',
    'Castle Theme' : 'Castle',
    'Pyramid Theme' : 'Pyramid',
    'Zombie Theme' : 'Zombie',
    'Candy Theme': 'Sweet'
}

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
export enum ENUM_FLY_TRAP_STATUS {
    IDLE = 'idle',
    FLY = 'fly',
    WALL_IN = 'wall_in',
    WALL_OUT = 'wall_out',
    HIT = 'hit'
}

export enum ENUM_REVERSE_TRAP_STATUS {
    IDLE = 'idle',
    MOVE = 'move',
}

export enum ENUM_SHOOTER_STATUS {
    IDLE = 'idle',
    ATTACK = 'attack'
}


// 碰撞类型
export enum ENUM_COLLIDER_TAG {
    PLAYER = 0,
    GROUND = 1,
    WALL = 2,
    LADDER = 3,
    // ENDPOINT = 4,
    FLY_TRAP = 5,
    SPIKE = 6,
    FLY_TRAP_VIEW = 7,
    REVERSE_TRAP = 8,
    REVERSE_TRAP_VIEW = 9,
    HARD_TRAP_WALL = 10,
    // SAW = 11,
    MOVING_TRAP = 12,
    SOFT_TRAP = 13,
    TRAMPOLINE = 14,
    // PLANT_VIEW = 15,
    BULLET = 16,
    REWARD = 17,
    // ANANAS = 18,
    // MELON = 19,
    HIDE_TRAP = 20,
    HIDE_TRAP_VIEW = 21,
    SOFT_TRAP_DESTROY = 22,
    LAVA = 23,
    MAGNET_BOOSTER = 24,
    SPEED_BOOSTER = 25,
    SHIELD_BOOSTER = 26,
    RANDOM_BOOSTER = 27,

    MAGNET_RANGE = 28,
    HARD_TRAP_STAND = 29,

    ENEMY_VIEW_ZONE = 50,
}

// 事件
export enum ENUM_GAME_EVENT {
    PLAYER_JUMP = 'PLAYER_JUMP',
    PLAYER_CLIMB_END = 'PLAYER_CLIMB_END',
    GAME_START = 'GAME_START',
    GAME_RELIVE = 'GAME_RELIVE',
    UPDATE_SCORE = 'UPDATE_SCORE',
    GAME_WIN = 'GAME_WIN',
    GAME_LOSE = 'GAME_LOSE',
    CAMERA_MOVE = 'CAMERA_MOVE',
    EFFECT_STAR_PLAY = 'EFFECT_STAR_PLAY',
    EFFECT_PICKUP_COIN = 'EFFECT_PICKUP_COIN',
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
    BGM = 'bgm',
    BOOSTER_MAGNET = 'booster_magnet',
    BOOSTER_SHIELD = 'booster_shield',
    BOOSTER_SPEED = 'booster_speed',
    BOOSTER_RANDOM = 'booster_random',
    BUTTON_CLICK  = 'button_click',
    BUTTON_PLAY = 'button_play',
    REWARD1 = 'reward1',
    REWARD2 = 'reward2',
    PLAYER_CLIMB = 'player_climb',
    PLAYER_HIT = 'player_hit',
    PLAYER_JUMP = 'player_jump',
    DANGER_MOVING_TRAP = 'danger_moving_trap',
    HARD_TRAP_WALL = 'hard_trap_wall',
    SOFT_TRAP_WALL = 'soft_trap_wall',
    TRAMPOLINE = 'trampoline',
    TRAP_HIDE_STAND = 'trap_hide_stand',
    TRAP_FALL = 'trap_shot_cellar',
    TRAP_SHOT_REAR = 'trap_shot_rear',
    TRAP_STAND = 'trap_stand',
    REVERSE_MOVING_TRAP = "reverse_moving_trap",
    TRAP_HIDE_CELLAR = 'trap_hide_cellar',
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

export enum ITEM_CODE 
{
    LONG_LADDER = 1,
    MEDIUM_LADDER,
    SHORT_LADDER,
    REWARD_1,
    REWARD_2,
    SOFT_TRAP_WALL,
    HARD_TRAP_WALL,
    SPIKE,
    TRAP_SHOT_REAR,
    TRAP_SHOT_CELLAR,
    TRAP_HIDE_STAND,
    LOW_FLY_TRAP,
    HIGH_FLY_TRAP,
    RANDOM_FLY_TRAP,
    REVERSE_MOVING_TRAP,
    DANGER_MOVING_TRAP,
    IDLE_MOVING_TRAP,
    CIRCLE_MOVING_TRAP,
    RANDOM_MOVING_TRAP,
    BOOSTER_SPEED,
    BOOSTER_MAGNET,
    BOOSTER_SHIELD,
    BOOSTER_RANDOM,
    TRAMPOLINE,
}

export const ENUM_ITEM_COLLECTION = {
    [ITEM_CODE.LONG_LADDER] : 'Long Ladder',
    [ITEM_CODE.MEDIUM_LADDER] : 'Medium Ladder',
    [ITEM_CODE.SHORT_LADDER] : 'Short Ladder',
    [ITEM_CODE.REWARD_1] : 'Reward 1',
    [ITEM_CODE.REWARD_2] : 'Reward 2',
    [ITEM_CODE.SOFT_TRAP_WALL] : 'Soft Trap Wall',
    [ITEM_CODE.HARD_TRAP_WALL] : 'Hard Trap Wall',
    [ITEM_CODE.SPIKE] : 'Spike',
    [ITEM_CODE.TRAP_SHOT_REAR] : 'Trap Shot Rear',
    [ITEM_CODE.TRAP_SHOT_CELLAR] : 'Trap Shot Cellar',
    [ITEM_CODE.TRAP_HIDE_STAND] : 'Trap Hide Stand',
    [ITEM_CODE.LOW_FLY_TRAP] : 'Low Fly Trap',
    [ITEM_CODE.HIGH_FLY_TRAP] : 'High Fly Trap',
    [ITEM_CODE.RANDOM_FLY_TRAP] : 'Random Fly Trap',
    [ITEM_CODE.REVERSE_MOVING_TRAP] : 'Reverse Moving Trap',
    [ITEM_CODE.DANGER_MOVING_TRAP]: 'Danger Moving Trap',
    [ITEM_CODE.IDLE_MOVING_TRAP] : 'Idle Moving Trap',
    [ITEM_CODE.CIRCLE_MOVING_TRAP] : 'Circle Moving Trap',
    [ITEM_CODE.RANDOM_MOVING_TRAP]: 'Random Moving Trap',
    [ITEM_CODE.BOOSTER_SPEED]: 'Booster Speed',
    [ITEM_CODE.BOOSTER_MAGNET] : 'Booster Magnet',
    [ITEM_CODE.BOOSTER_SHIELD] : 'Booster Shield',
    [ITEM_CODE.BOOSTER_RANDOM] : 'Booster Random',
    [ITEM_CODE.TRAMPOLINE] : 'Trampoline'
}