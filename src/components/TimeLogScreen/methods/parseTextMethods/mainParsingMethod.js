export const parseAllEntriesFor = (entries, o, c) => {
    let openingTag = o + '&'
    let closingTag = '&' + c
    var data = []
    //this array is made up of the date and the raw text for the entire day
    entries.forEach((entry) => {
        
        let date = entry.date
        var formattedText = ''
        var entries = []
        var isComplete = true
        //for food entries, we want the default state for the day to be incomplete
        //we have to manually set it to complete by typing 'complete'
        if(openingTag == '&f'){
            isComplete = false
        }
        
        let lines = entry.rawEntry.split('\n')
        lines.forEach((line) => {
            //check if line has the opening and closing tags e.g. f& and &f; 
            if(line.includes(openingTag) && line.includes(closingTag)){
                //if yes, then we parse it out!
                var trackedString = line.substring(
                    line.lastIndexOf(openingTag) + 2,
                    line.lastIndexOf(closingTag)
                );
                if(trackedString.includes('complete')){
                    isComplete = true
                }
                trackedString = trackedString.trim()
                //add the entry to our arry of entries for the day!
                entries.unshift(trackedString)
                //update the formattedText (what will display on the homepage)
                formattedText = trackedString + "; " + formattedText
            }
        })
        if(entries.length !== 0) {
            var trackedString = {
                date,
                entries,
                isComplete,
                formattedText
            }
            data.push(trackedString)
        }
    })
    return data
    
}