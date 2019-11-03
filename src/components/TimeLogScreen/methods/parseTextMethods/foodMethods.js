export const parseAllEntriesForFoodEntries = (entries) => {
    //this array is made up of the date and the raw text.
    entries.forEach((entry) => {
        // let date = entry.date
        let lines = entry.rawEntry.split('\n')
        lines.forEach((line,index) => {
            //check if line has special entry; see if we can install
            if(line.includes('f&') && line.includes('&f')){
                // let endTime = lines[index-1]
                // let startTime = lines[index+1]
                // let rawEntry = line
                //get the habit substring from the text
                var foodTitle = line.substring(
                    line.lastIndexOf("f&") + 2,
                    line.lastIndexOf("&f")
                );
                console.log('found: ', foodTitle)
            }
        })
    })
}