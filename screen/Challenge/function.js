export function acceptorRating(acceptorArr) {
    console.log('object1',acceptorArr)
    let sum = 0;
    for (let i in acceptorArr) {
        sum += acceptorArr[i].rating;
    }
    return sum;
}
export function creatorRating(creatorArr) {
    console.log('object2',creatorArr)
    let sum = 0;
    for (let i in creatorArr) {
        sum += creatorArr[i].rating;
    }
    return sum;
}