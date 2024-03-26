// Created by carolsail

export function random(lower: number, upper:number): number {
    return Math.floor(Math.random() * (upper - lower+1)) + lower;
}


export function randomInList(lst: number[]){
    let length = lst.length;
    let index = random(0,length-1);
    return lst[index];
}

export function shuffle(arr: any[]){
    let length: number = arr.length,
        randomIndex: number,
        temp: any;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr
}

export function sort(arr: any[] | unknown, key: any, flag: boolean = true){
    if(arr instanceof Array){
        return arr.sort((a, b)=>{
            if(a[key] > b[key]){
                return flag ? 1 : -1
            }else if(a[key] < b[key]){
                return flag ? -1 : 1
            }else{
                return 0
            }
        })
    }
}

export function  Vec3ToVec2(vec3:cc.Vec3): cc.Vec2 {
    return new cc.Vec2(vec3.x, vec3.y)
}

export function  Vec2ToVec3(vec2:cc.Vec2): cc.Vec3 {
    return new cc.Vec3(vec2.x, vec2.y)
}


export function delay(delay: number){
    return new Promise((resolve) => setTimeout(resolve, delay));
}