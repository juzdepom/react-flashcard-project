export const calculateTotalExpPoints = (array) => {
    let totalExp = array[0] + (array[1] * 2) + (array[2] * 3) + (array[3] * 4) + (array[4] * 5) + (array[5] * 6)
    return totalExp;
}

export const calculateTotalDeckCount = (array) => {
    let count = array.reduce((a, b) => a + b, 0)
    return count;
}

export const addPlusSignIfPositive = (n) => {
    return (n<0?"":"+") + n
}

export const sortCardsFromLastReviewed = (cards) => {
    cards.sort(function(first, second){
            var a = 1
            var b = 0
            if(first["lastReviewed"] != undefined && second["lastReviewed"] != undefined){
                let lastIndexA = first["lastReviewed"].length-1
                 a = first["lastReviewed"][lastIndexA]

                let lastIndexB = second["lastReviewed"].length-1
                b = second["lastReviewed"][lastIndexB]
            }
            return a - b
    });
    return cards
}