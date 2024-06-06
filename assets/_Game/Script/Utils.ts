// Created by carolsail

export function random(lower: number, upper:number): number {
    return Math.floor(Math.random() * (upper - lower+1)) + lower;
}


export function randomInList<T>(lst: T[]) : T | undefined{
    if(lst.length == 0) return undefined;
    return lst[Math.floor(Math.random() * lst.length)];
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

export function getLastElement<T>(arr: T[]) : T | undefined {
    if(arr.length == 0) return undefined;
    else{
        let length = arr.length;
        return arr[length - 1];
    }
}

export function getNextLastElement<T>(arr: T[]) : T | undefined {
    if(arr.length == 0) return undefined;
    else{
        let length = arr.length;
        return arr[length - 2];
    }
}

export function delay(delay: number){
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function setMix(spine: sp.Skeleton, anim1: string, anim2: string, mixTime: number = 0.1) {
    spine?.setMix(anim1, anim2, mixTime);
    spine?.setMix(anim2, anim1, mixTime);
}

export class Queue<T>{
    private storage: T[] = [];
  
    constructor(private capacity: number = Infinity) {}
  
    enqueue(item: T): void {
      if (this.size() === this.capacity) {
        throw Error("Queue has reached max capacity, you cannot add more items");
      }
      this.storage.push(item);
    }
    dequeue(): T | undefined {
      return this.storage.shift();
    }
    size(): number {
      return this.storage.length;
    }
  }