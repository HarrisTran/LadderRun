// // Created by carolsail
// // 目前数量20，关卡依据单数、偶数...排列定义
// export const levels = [
//     [1, 20, 1, 20],
//     [1, 4, 5, 6, 1, 20],
//     [1, 8, 13, 12, 7, 20],
//     [17, 4, 15, 6, 9, 20],
//     [1, 6, 7, 16, 13, 20],
//     [1, 6, 11, 8, 7, 12, 9, 20],
//     [17, 4, 3, 2, 11, 10, 13, 20],
//     [17, 6, 7, 8, 5, 12, 15, 20],
//     [1, 14, 5, 6, 13, 14, 11, 20],
//     [17, 6, 15, 8, 7, 16, 13, 6, 3, 20],
//     [17, 8, 13, 6, 15, 4, 17, 4, 5, 20],
//     [17, 10, 9, 16, 11, 8, 9, 12, 15, 20],
//     [1, 4, 9, 12, 7, 8, 5, 12, 17, 2, 3, 20],
//     [1, 6, 7, 14, 5, 12, 11, 14, 15, 4, 9, 20],
//     [1, 6, 3, 2, 7, 8, 5, 14, 9, 16, 3, 4, 11, 20],
//     [1, 12, 17, 8, 9, 14, 9, 10, 3, 10, 5, 6, 7, 20],
//     [1, 4, 5, 2, 13, 10, 11, 16, 3, 2, 3, 4, 11, 8, 15, 20],
//     [17, 12, 11, 16, 7, 10, 9, 12, 5, 18, 13, 6, 3, 16, 11, 20],
//     [17, 4, 9, 2, 11, 10, 9, 16, 3, 14, 5, 10, 7, 6, 13, 12, 7, 20],
//     [17, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 1, 18, 19, 20],
// ]

// const easyList = [1,6,7,9,11,12,15,17,20]
// const mediumList = [2,4,5,13]
// const hardList = [3,8,10,14,16,18,19]
const easyList = [22,23,24,30,35,40]
const mediumList = [25,26,27,28,29,31,34,36,39]
const hardList = [32,33,37,38]

export function createLevelDesign(numberOfEasy: number, numberOfMedium: number, numberOfHard: number){
    let stack : number[] = [];
    for(let i=0; i<numberOfEasy;i++){
        let index = Math.floor(Math.random()*easyList.length);
        stack.push(easyList[index]);
    }
    for(let i=0; i<numberOfMedium;i++){
        let index = Math.floor(Math.random()*mediumList.length);
        stack.push(mediumList[index]);
    }
    for(let i=0; i<numberOfHard;i++){
        let index = Math.floor(Math.random()*hardList.length);
        stack.push(hardList[index]);
    }
    // return stack;
    return [21,11,18,15,4,11,8,9,21]
}
