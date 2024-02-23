
const easyList = [1,2,3,9,14,19,20,21]
const mediumList = [4,5,6,7,8,10,13,15,18]
const hardList = [11,12,16,17]

export function createLevelList(){
    let levels = [easyList,mediumList,hardList].reduce((accumulator,value)=>accumulator.concat(value),[]);
    return levels;
}