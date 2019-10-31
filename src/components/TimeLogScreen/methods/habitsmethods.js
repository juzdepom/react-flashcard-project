export const parseAllEntriesForHabits = (timeLogEntries) => {
    let habits = []
    let entries = timeLogEntries

    //loop through entries
    entries.forEach((entry) => {
        //extract the date
        let date = entry.date
        //extract the rawEntry text
        let rawEntry = entry.rawEntry
        //split by newline
        let lines = rawEntry.split('\n')
        //loop through lines
        lines.forEach((line, index) => {
            //found a habit!
            if(line.includes('h&') && line.includes('&h')){
                let endTime = lines[index-1]
                let startTime = lines[index+1]
                let rawEntry = line
                //get the habit substring from the text
                var habitTitle = line.substring(
                    line.lastIndexOf("h&") + 2,
                    line.lastIndexOf("&h")
                );

                //these will go into the entry variable below
                var details, number = null
                
                //check if habitTitle has details. e.g. run: 3km 
                if(habitTitle.includes(":")){
                    //split by :
                    let arr = habitTitle.split(':')
                    //make sure that there are only 2 elements in the array
                    if(arr.length > 2){console.error('Warning! HabitTitle has more than on colon: ', habitTitle)}
                    //habitTitle is the first item in the array e.g. run
                    habitTitle = arr[0].trim()
                    //e.g. 3km or halloween post
                    details = arr[1].trim()
                    
                    //e.g. 3km -> 3 //if there are no digits though, will return null. 
                    number = details.match(/\d+/)
                    if(number != null){
                        number = number[0]
                    }
                    //regex to pull out the number
                    //if you were parsing 8min detail.match(/\d+/) will return sth like this ["8", index: 0, input: "8min", groups: undefined] 
                    

                }

                //create the entry
                let entry = {
                    title: habitTitle,
                    date,
                    entry: {
                        details,
                        number,
                        startTime,
                        endTime,
                        rawEntry,
                        date,
                    }
                }
                
                //check if the length of our master habits array is 0
                if(habits.length > 0) {
                    var habitDoesNotExist = true
                    //if not, loop through each habit
                    habits.forEach((habit) => {
                        //check if the habit already exists in the habits array
                        if(habit.title === habitTitle){
                            //habit exists!
                            habitDoesNotExist = false;
                            habit.entries.push(entry)
                        }
                    })
                    //habit doesn't exist yet
                    if(habitDoesNotExist){
                        //create a new habit
                        let newHabit = {
                            title: habitTitle,
                            entries: [entry]
                        }
                        habits.push(newHabit)
                    }
                } else {
                    //if there is nothing in habits array, this will be the first entry
                    //which means it will be a new habit
                    let newHabit = {
                        title: habitTitle,
                        entries: [entry]
                    }
                    habits.push(newHabit)
                }
                console.log('habits: ', habits)
            }
        })
    })
}