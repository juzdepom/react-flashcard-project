import React from 'react';
//styling
import './AllEntries.scss';
//components
import ClientWorkContainer from './ClientWork/ClientWorkContainer';
import BlueOutlineButton from '../Buttons/BlueOutlineButton';

import {
    convertMinutesToHoursAndMinutes,
    returnBackgroundTypeBasedOnHashtag,
    turnTimeLogStringArrayIntoArrayOfDict,
    parseEntryDataArrayIntoHashtagArray,
    calculateTotalTimeLoggedFromEntryData,
    convertMilitaryTimeToTwelveHourTime,
    formatDate,
} from '../../methods/methods';

//ENTRY COMPONENT
class Entry extends React.Component {

    parseRawTextForHashtagData = (rawText) => {
        if(rawText === undefined){ return [] }
        let arrayOfStrings = rawText.split('\n')
        let entryData = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)
        let hashtagData = parseEntryDataArrayIntoHashtagArray(entryData)
        return hashtagData
    }

    showDetailsForHashtag = (hashtag) => {
        if(hashtag === "#clientwork"){
            this.props.showClientWorkComponent()
        } else {
            alert(`show details for hashtag: ${hashtag}`)
        }
        
    }
    
    navigateToDate = (date) => {
        alert(`navigate to date: ${date}`)
    }

    returnFormattedHashtagData = (hashtagData) => {
        var formattedHashtagData = ''
        if(hashtagData.length === 0){
            return formattedHashtagData
        }

        formattedHashtagData = hashtagData.map((item, i) => {
            let hashtag = item["hashtag"]
            let time = convertMinutesToHoursAndMinutes(item["time"])
            let backgroundType = returnBackgroundTypeBasedOnHashtag(hashtag)
            let className = "bg-"+backgroundType
            return(
                <div key={i} className={className}>
                    <button 
                        onClick={() => this.showDetailsForHashtag(hashtag)}>
                        {hashtag}: {time}
                    </button>
                </div>
            )
            
        })
        return formattedHashtagData;
    }

    returnTotalTimeLogged = (rawEntry) => {
        var preparedEntry = ''
        if(rawEntry.includes('=====')){
            preparedEntry = rawEntry.split('=====')[1]
        } else {
            preparedEntry = rawEntry
        }
        
        let arrayOfStrings = preparedEntry.split('\n')
        if(arrayOfStrings.length < 2){return rawEntry}
        //turn raw text into readable data
        let entry = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)

        let totalTimeLogged = calculateTotalTimeLoggedFromEntryData(entry)

        console.error('TODO: currently if the timelog page loads on all entries, it crashes in total time logged')

        //the first entry time will be the last element in the array
        //if we haven't logged anything yet today, the first entry time will be undefined
        var firstEntryTime = (entry[entry.length-1] === undefined) ? NaN : entry[entry.length-1]["startTime"]
        //e.g. 18:00 to 6:00 PM
        if(firstEntryTime.includes(':')) {
            firstEntryTime = convertMilitaryTimeToTwelveHourTime(firstEntryTime)}
        //first element in the array
        var lastEntryTime = entry[0]["endTime"]
        if(lastEntryTime.includes(':')){
        lastEntryTime = convertMilitaryTimeToTwelveHourTime(lastEntryTime)}
        //return formatted string
        return `${firstEntryTime} - ${lastEntryTime} (${totalTimeLogged})`
    }

    render(props){
        let date = formatDate(this.props.day["date"], true)
        let details = this.returnTotalTimeLogged(this.props.day["rawEntry"])
        let hashtagData = this.parseRawTextForHashtagData(this.props.day["rawEntry"])
        let hashtags = this.returnFormattedHashtagData(hashtagData)
        return (
            <div className="allEntries--entry">

                <div className="allEntries--entry-title">
                    <button 
                        onClick={() => this.navigateToDate(date)}>
                        {date}
                    </button>

                    <br/>
                    {details}
                </div>
                
                {hashtags}

            </div>
        )
    }

}

//ALL ENTRIES COMPONENT
class AllEntries extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            dailyDisplayIsShowing: true,
            weeklyDisplayIsShowing: false,
            monthlyDisplayIsShowing: false,
            clientWorkComponentIsShowing: false,
        }
    }

    //shows this components when the #clientwork is clicked on any specific day
    showClientWorkComponent = () => {
        this.setState({clientWorkComponentIsShowing: true})
    }

    //close the container when the close button is pressed. This will be passed as props into the component
    closeClientWorkContainer = () => {
        this.setState({clientWorkComponentIsShowing: false})
    }

    //pass data into the Entry componenent and render
    renderEntries = () => {
        return this.props.allEntries.map((item, index) => {
            return <Entry key={index} showClientWorkComponent={this.showClientWorkComponent} day={item}/>
        });
    }

    //methods that toggle which displays are showing: daily, weekly or monthly
    toggleDisplay = (displayType) => {
        var dailyDisplayIsShowing = false, weeklyDisplayIsShowing = false,  monthlyDisplayIsShowing = false;

        switch(displayType){
            case "day": dailyDisplayIsShowing = true
            break;
            case "week": weeklyDisplayIsShowing = true
            break;
            case "month" : monthlyDisplayIsShowing = true;
            default: console.error(`displayType ${displayType} is invalid. Check for typos`)
        }

        this.setState({dailyDisplayIsShowing, weeklyDisplayIsShowing, monthlyDisplayIsShowing})
    }



    render(props) {
        return (
            <div className="allEntries">
                
                <div>
                    <BlueOutlineButton
                        disabled={this.state.dailyDisplayIsShowing}
                        click={() => this.toggleDisplay("week")}
                        text="DAY"
                    />

                </div>
                
                <div className="allEntries--display">
                    {this.renderEntries()}
                </div>
                

                { this.state.clientWorkComponentIsShowing &&
                 <ClientWorkContainer 
                    allEntries={this.props.allEntries}
                    closeClientWorkContainer={this.closeClientWorkContainer}/> 
                }
               
            </div>

            
        );
    }
}





export default AllEntries;