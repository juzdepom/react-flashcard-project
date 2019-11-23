export const parseAllEntriesForHabits = (timeLogEntries) => {
    let habits = []
    let today = []
    let entries = timeLogEntries

    //loop through entries
    entries.forEach((entry, entryIndex) => {
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
                // console.log(`date ${date} : ${habitTitle}`)

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

                // console.log('entry: ', entry)

                //if the entryIndex is zero, that means we are on our most recent entry
                //populate the today array
                if(entryIndex === 0){
                    if(today.length === 0){
                        let newHabit = {
                            title: habitTitle,
                            entries: [entry]
                        }
                        today.push(newHabit)
                    } else {
                        var habitDoesNotExist = true
                        today.forEach((habit) => {
                            if(habit.title === habitTitle){
                                //habit type exists
                                habitDoesNotExist = false;
                                today.entries.push(entry)
                            }
                        })
                        if(habitDoesNotExist){
                            let newHabit = {
                                title: habitTitle,
                                entries: [entry]
                            }
                            today.push(newHabit)
                        }
                    }
                }
                
                //check if the length of our master habits array is 0
                //populate the habits array
                if(habits.length > 0) {
                    var habitDoesntExist = true
                    //if not, loop through each habit
                    habits.forEach((habit) => {
                        //check if the habit already exists in the habits array
                        if(habit.title === habitTitle){
                            //habit exists!
                            habitDoesntExist = false;
                            habit.entries.push(entry)
                        }
                    })
                    //habit doesn't exist yet
                    if(habitDoesntExist){
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
                
            }
        })
    })

    // console.log('habits: ', habits)

    let numberOfHabitTypes = habits.length
    //format the entry text
    var formattedText = ''
    today.forEach((habit) => {
        //loop through each habit type
        var habitText = habit.title
        //check to get how many entries have already been made of this title
        var numberOfHabitEntriesOfThisType = 0
        habits.forEach((h) => {
            if(h.title === habit.title){
                numberOfHabitEntriesOfThisType = h.entries.length
            }
        })
        //add the number of entries
        habitText = `(${numberOfHabitEntriesOfThisType}) ${habitText} `
        //TO DO: calculate the consecutive streak you are currently on
        habit.entries.forEach((e) => {
            let entry = e.entry
            // var { startTime, endTime, details } = entry
            let { details } = entry
            //TO DO: save this data in firebase
            //add a little achievement symbol if you reached 7km 🏅
            if(habit.title === "run"){
                //have to get the total
            }
            //formatting the string
            if(details !== undefined){ habitText = `${habitText}: ${details}` }
            // let string = `(${startTime}-${endTime}) ${habitText}`
            // tried including the times, but it's not actually that important
            let string = `${habitText}`
            formattedText = string + "; " + formattedText 
        });
    })

    console.error('TODO: currently the habits method code is formatted so that it only shows the habits for the current day')
    let data = {
        numberOfEntries: numberOfHabitTypes,
        formattedText,
        todaysEntries: today,
        allHabits: habits
    }
    
    // console.log('number of habits: ', numberOfHabits)
    // console.log('habits: ', data)
    return data
}