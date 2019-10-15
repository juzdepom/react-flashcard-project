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