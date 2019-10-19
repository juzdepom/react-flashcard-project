export const turnTimeLogStringArrayIntoArrayOfDict = (arrayOfStrings) => {
    var arrayOfDict = []
    var activity = {}
    activity["rawText"] = ""
    var counter = 0

    for (var i in arrayOfStrings){
        let line = arrayOfStrings[i]

        //if line begins with a digit, it is a time entry. e.g. 17:30
        if(line.match(/^\d/) && counter === 0){
            activity["startTime"] = line
            counter = counter + 1

        } else if (line.match(/^\d/) && counter === 1) {
            activity["endTime"] = line
            arrayOfDict.push(activity)
            //clear the dict
            activity = {}
            //create new activity entry
            activity["startTime"] = line
            activity["rawText"] = ""
            
        } else { // this is raw text
            activity["rawText"] += " " +  line
        }
    }
    return arrayOfDict
}

export const returnBackgroundTypeBasedOnHashtag = (h) => {
    let hashtag = String(h)
    var color = "default"
    let hashtagRegex = /#[a-z]+/gi // this does not include any of the characters after the dash

    var parentHashtag = hashtag.match(hashtagRegex);
    
    //remove the hashtag
    let p = String(parentHashtag).substr(1)
    if (p == "coding" || p == "clientwork" || p == "instagram"){
        color = p;
    }
    
    return color
}

export const getHashtagsFromRawText = (rawText) => {

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
        alert(`Error! Elapsed time is negative: ${elapsed}! Start Time: ${s}/${startTime} End Time: ${e}/${endTime}`)
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
        console.log(hours)
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
        minutes = "0" + minutes
    }

    return hours + ":" + minutes + " " + ampm
}

//returns 3h20
export const convertMinutesToHoursAndMinutes = (m) => {
    let totalMin = parseInt(m)
    if(totalMin === NaN) {
        alert(`Error! Minutes are not a valid Int: ${m}`)
        return NaN
    } else {
        let h = Math.floor(totalMin/60);
        let min = totalMin % 60;
        if(h < 1){
            return min + "min"
        } else {
            return h + "h" + min;
        }
    }
}

