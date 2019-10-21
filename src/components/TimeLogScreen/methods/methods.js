export const parseEntryDataArrayIntoHashtagArray = (entryData, hashtagDataIncludesDash) => {
    var hashtagDataDict = {}
    for(var i in entryData){
        let item = entryData[i]
        let rawText = item["rawText"]

        let hashtagRegex = (hashtagDataIncludesDash) ? /#[a-z-]+/gi : /#[a-z]+/gi
        // let hashtagRegex = /#[a-z-]+/gi
        let hashtags = rawText.match(hashtagRegex);
        // console.log(hashtag)
        // let hashtagArray = hashtags.split(',')

        var startTime = item["startTime"]
        var endTime = item["endTime"]
        let elapsedTime = calculateElapsedTime(startTime, endTime, true)
        for(var i in hashtags){
            let hashtag = hashtags[i]
            if(hashtagDataDict[hashtag] == undefined){
                hashtagDataDict[hashtag] = 0
            }
            hashtagDataDict[hashtag] = parseInt(hashtagDataDict[hashtag]) + parseInt(elapsedTime);
        }
        
    }

    var hashtagData = []
    for(var key in hashtagDataDict){
        var hashtagDict = {}
        hashtagDict["hashtag"] = key
        hashtagDict["time"] = hashtagDataDict[key]
        hashtagData.push(hashtagDict)
    }

        // console.log(hashtagData)
    hashtagData = sortHashtagsFromLengthOfTime(hashtagData)
    return hashtagData
}

export const calculateTotalTimeLoggedFromEntryData = (entryData, onlyMinutes) => {
    var totalTime = 0
    for(var i in entryData){
        let startTime = entryData[i]["startTime"]
        let endTime = entryData[i]["endTime"]
        let elapsed = calculateElapsedTime(startTime, endTime, true)
        totalTime = totalTime + elapsed
    }
    if(onlyMinutes){ 
        return totalTime 
    } else { 
        totalTime = convertMinutesToHoursAndMinutes(totalTime)
        return totalTime
    }
    
}

export const turnTimeLogStringArrayIntoArrayOfDict = (arrayOfStrings) => {
    var arrayOfDict = []
    var activity = {}
    activity["rawText"] = ""
    var counter = 0

    for (var i in arrayOfStrings){
        let line = arrayOfStrings[i]

        //if line begins with a digit, it is a time entry. e.g. 17:30
        if(line.match(/^\d/) && counter === 0){
            // activity["startTime"] = line
            activity["endTime"] = line
            counter = counter + 1

        } else if (line.match(/^\d/) && counter === 1) {
            // activity["endTime"] = line
            activity["startTime"] = line
            arrayOfDict.push(activity)
            //clear the dict
            activity = {}
            //create new activity entry
            activity["endTime"] = line
            // activity["startTIme"] = line
            activity["rawText"] = ""
            
        } else { // this is raw text
            activity["rawText"] += " " +  line
        }
    }
    return arrayOfDict
}

//hashtags that are the longest appear first
export const sortHashtagsFromLengthOfTime = (hashtagArray) => {
    hashtagArray.sort(function(first, second){
        var a = 1
        var b = 0
        
        if(first["time"] != undefined && second["time"] != undefined){
            a = first["time"]
            b = second["time"]
        }
        return b - a
});

return hashtagArray
}

export const returnHeightTypeBasedOnTime = (time) => {
    switch(true){
        case (time > 15 && time < 30): return "15-30";
        case (time > 30 && time < 60): return "30-60";
        case (time > 60 && time < 120): return "60-120";
        case (time > 120 && time < 240): return "120-240";
        case (time > 240): return "240"
    }
    return "default"
}

export const returnBackgroundTypeBasedOnHashtag = (h) => {
    let hashtag = String(h)
    var color = "default"
    let hashtagRegex = /#[a-z]+/gi // this does not include any of the characters after the dash

    var parentHashtag = hashtag.match(hashtagRegex);
    
    //remove the hashtag
    let p = String(parentHashtag).substr(1)
    let c = [
        "coding", 
        "clientwork", 
        "myinstagram", 
        "nap", 
        "studythai", 
        "muaythai", 
        "selfcare",
        "running",
        "timelog",
        "food",
        "badhabits",
        "rov",
        "Baow",
    ]
    for(var i in c){
        if(p == c[i]){
            color = p;
        }
    }
    
    return color
}

export const getCurrentTime = () => {
    let date =  new Date();
    let hours = date.getHours()
    let min = date.getMinutes()
    let militaryTime = hours + ":" + min
    return militaryTime
}

export const getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today
}

//convert from 14-10-2019 to Oct 14, 2019
export const formatDate = (dateString) => {
    if(dateString==null){return "Loading..."}
    var arr = dateString.split("-")
    if(arr.length <= 2){return "Loading..."}
    let day = arr[0].trim()
    let year = arr[2].trim()
    let monthInt = parseInt(arr[1].trim())
    var month = ""
    switch(monthInt){
        case 1: month = "Jan"
        break;
        case 2: month = "Feb"
        break;
        case 3: month = "Mar"
        break;
        case 4: month = "Apr"
        break;
        case 5: month = "May"
        break;
        case 6: month = "June"
        break;
        case 7: month = "July"
        break;
        case 8: month = "Aug"
        break;
        case 9: month = "Sep"
        break;
        case 10: month = "Oct"
        break;
        case 11: month = "Nov"
        break;
        case 12: month = "Dec"
        break;
        default:
            alert(`Error: monthInt out of range: ${monthInt}`)
            break;
    }
    var newString = month + " " + day + ", " + year
    return newString
}

//this method only works for military hours in a day (e.g. 13:10 - 14:45)
export const calculateElapsedTime = (s, e, onlyMinutes) => {
    var startTime  = convertMilitaryTimeToMinutes(s)
    var endTime = convertMilitaryTimeToMinutes(e)
    var elapsed = endTime - startTime
    
    if(elapsed <= 0){
        console.log(`Error! Elapsed time is negative: ${elapsed}! Start Time: ${s}/${startTime} End Time: ${e}/${endTime}`)
        // alert(`Error! Elapsed time is negative: ${elapsed}! Start Time: ${s}/${startTime} End Time: ${e}/${endTime}`)
        return NaN
    } else {
        if(onlyMinutes){
            return elapsed;
        } else {
            return convertMinutesToHoursAndMinutes(elapsed)
        }
        
    }

}

export const convertMilitaryTimeToMinutes = (t) => {
    let time  = t.split(":")

    let error = `Error! This is not a valid time entry: ${t}`
    if(time.length < 2 || time.length > 2){ 
        alert(error)
        return error;
    }

    var hours = parseInt(time[0])
    var minutes = parseInt(time[1])

    if (hours === NaN || minutes === NaN){
        alert(error)
        return error;
    }

    minutes = minutes + (hours * 60)
    return minutes;
}

//e.g. 14:30 to 2:30 PM
export const convertMilitaryTimeToTwelveHourTime = t => {
    let time  = t.split(":")
    
    let error = `Error! This is not a valid time entry: ${t}`
    if(time.length < 2 || time.length > 2){ 
        alert(error)
        return error;
    }

    var hours = parseInt(time[0])
    var minutes = parseInt(time[1])

    if (hours === NaN || minutes === NaN){
        alert(error)
        return error;
    }
   
    var ampm = ""
    if(hours > 11 && hours < 24){
        // console.log(hours)
        ampm = "PM"
        if(hours != 12){
            hours = hours - 12
        }
    } else if (hours > -1 && hours < 12){
        ampm = "AM"
        if(hours === 0){hours = 12}
    } else {
        alert(`Error! ${t} is not a valid military time!`)
        return NaN
    }

    if(minutes < 10){
        // alert('this is called!')
        minutes = "0" + minutes
    }
    let twelveHourTime = hours + ":" + minutes + " " + ampm
    return twelveHourTime
}

//returns 3h20
export const convertMinutesToHoursAndMinutes = (m) => {
    let totalMin = parseInt(m)
    if(totalMin === NaN) {
        alert(`Error! Minutes are not a valid Int: ${m}`)
        return NaN
    } else {
        let h = Math.floor(totalMin/60);
        var min = totalMin % 60;
        if(h < 1){
            return min + "m"
        } else {
            if(min < 10){ min = "0" + min}
            return h + "h" + min;
        }
    }
}

