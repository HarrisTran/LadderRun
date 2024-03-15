
const subEasyList = [26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
const easyList = [1,2,4,5,9,14,15,24]
const mediumList = [3,6,8,10,16,17,18,19,20]
const hardList = [7,11,12,13,22,23]
const bonusList = [21,25]

export function createLevelList(){
    let levels = [easyList,mediumList,hardList].reduce((accumulator,value)=>accumulator.concat(value),[]);
    return levels;
}

export function createCycleBlockList(subEasy: number, easy: number, medium: number, hard: number,bonusList: number[] = [21,25])
{
    let result : number[] = [];
    const getRandomElements = (arr: number[], count: number): number[] => {
        if(count <= 0) return [];
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    result.push(...getRandomElements(subEasyList,subEasy))
    result.push(...getRandomElements(easyList,easy))
    result.push(...getRandomElements(mediumList,medium))
    result.push(...getRandomElements(hardList,hard))
    result.push(...getRandomElements(bonusList,1))
    return result;
}