
const easyList = [1,2,3,5,8,9,14,20,24]
const mediumList = [4,6,7,10,15,18,19]
const hardList = [11,12,13,16,17,22,23]
const bonusList = [21,25]

export function createLevelList(){
    let levels = [easyList,mediumList,hardList].reduce((accumulator,value)=>accumulator.concat(value),[]);
    return levels;
}

export function createCycleBlockList(easy: number, medium: number, hard: number,bonusList: number[] = [21,25])
{
    let result : number[] = [];
    const getRandomElements = (arr: number[], count: number): number[] => {
        if(count <= 0) return [];
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    result.push(...getRandomElements(easyList,easy))
    result.push(...getRandomElements(mediumList,medium))
    result.push(...getRandomElements(hardList,1))
    result.push(...getRandomElements(mediumList,1))
    result.push(...getRandomElements(hardList,1))
    result.push(...getRandomElements(bonusList,1))
    return result;
}