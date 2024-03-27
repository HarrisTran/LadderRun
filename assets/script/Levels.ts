
const easyList = [1, 2, 3, 5, 8, 9, 14, 20, 24, 26, 27, 28, 29, 39, 31, 33, 43, 44, 45, 46, 47]
const mediumList = [4, 6, 7, 10, 15, 19, 32, 40, 41, 42, 51, 52, 54, 57, 58, 59, 62]
const hardList = [11, 12, 13, 16, 17, 23, 35, 38, 39, 53, 55, 56, 60, 61, 64]
const bonusList = [21, 25, 34, 36]
const middleLadder = [18, 49, 63]
const spikeball = [22, 37]

export function createLevelList(){
    let levels = [easyList,mediumList,hardList].reduce((accumulator,value)=>accumulator.concat(value),[]);
    return levels;
}

export function createCycleBlockList()
{
    let result : number[] = [];
    const getRandomElements = (arr: number[], count: number): number[] => {
        if(count <= 0) return [];
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    //result.push(...getRandomElements(subEasyList,subEasy))
    result.push(...getRandomElements(easyList,5))
    result.push(...getRandomElements(mediumList,2))
    result.push(...getRandomElements(hardList,2))
    result.push(...getRandomElements(middleLadder,1))
    result.push(...getRandomElements(bonusList,1))
    result.push(...getRandomElements(spikeball,1))
    
    return result;
}