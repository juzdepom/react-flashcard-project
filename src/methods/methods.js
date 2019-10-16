//convert from 14-10-2019 to Oct 14, 2019
export const convertDate = (dateString) => {
    var arr = dateString.split("-")
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

//returns dd-mm-yyyy format
export const returnDateString = (date) => {
    // var today = new Date();
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    let dateString = dd + '-' + mm + '-' + yyyy;
    return dateString
}

export const calculateElapsedTime = (timestamp) => {
    var prevTime = new Date(timestamp * 1000);  // Feb 1, 2011
    var thisTime = new Date();              // now
    var diff = thisTime.getTime() - prevTime.getTime();
    var seconds = Math.floor(diff/1000)
    
    if(seconds < 60) { return "> " + seconds + " seconds"} else
    //3600 seconds in an hour
    if(seconds < 3600) {
        var m = Math.floor(seconds/60); 
        var s = seconds % 60; 
        return "> " + m + " min " + s + " sec";
    } //86400 seconds in 24 hours
    else if (seconds < 86400){
        var h = Math.floor(seconds/3600);
        var m = seconds % 3600 //seconds left
        m = Math.floor(m/60)
        return "> " + h + " hr " + m + " min";
    } else {
        var d = Math.floor(seconds/86400);
        var h = seconds % 86400; // seconds left
        h = Math.floor(h/3600)
        return "> " + d + " day " + h + " hr";
    }
}