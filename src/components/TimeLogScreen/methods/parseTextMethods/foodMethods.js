export const parseAllEntriesForFoodEntries = (entries) => {
    //this array is made up of the date and the raw text.
    var data = []
    entries.forEach((entry) => {
        // var foodEntry = {}
        let date = entry.date
        var formattedText = ''
        var entries = []
        var isComplete = false
        let lines = entry.rawEntry.split('\n')
        lines.forEach((line) => {
            //check if line has special food entry; 
            if(line.includes('f&') && line.includes('&f')){
                //if yes, then we parse it out!
                var foodEntry = line.substring(
                    line.lastIndexOf("f&") + 2,
                    line.lastIndexOf("&f")
                );
                if(foodEntry.includes('complete')){
                    isComplete = true
                }
                foodEntry = foodEntry.trim()
                //add the entry to our arry of entries for the day!
                entries.unshift(foodEntry)
                //update the formattedText (what will display on the homepage)
                formattedText = foodEntry + "; " + formattedText
            }
        })
        if(entries.length !== 0) {
            var foodEntry = {
                date,
                entries,
                isComplete,
                formattedText
            }
            data.push(foodEntry)
        }
    })
    console.log('food entries data: ', data)
    return data
    
}