import React from 'react';
import './AllEntries.scss';

import ClientWorkContainer from './ClientWork/ClientWorkContainer';

import {
    convertMinutesToHoursAndMinutes,
    returnBackgroundTypeBasedOnHashtag,
    turnTimeLogStringArrayIntoArrayOfDict,
    parseEntryDataArrayIntoHashtagArray,
    calculateTotalTimeLoggedFromEntryData,
    convertMilitaryTimeToTwelveHourTime,
    formatDate,
} from '../methods/methods';

class Entry extends React.Component {
    constructor(props){
        super(props)
    }

    parseRawTextForHashtagData = (rawText) => {
        if(rawText == undefined){ return [] }
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
                <div className={className}>
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
        let arrayOfStrings = rawEntry.split('\n')
        if(arrayOfStrings.length < 2){return rawEntry}
        let entry = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)
        let totalTimeLogged = calculateTotalTimeLoggedFromEntryData(entry)
        var firstEntryTime = entry[entry.length-1]["startTime"]
        firstEntryTime = convertMilitaryTimeToTwelveHourTime(firstEntryTime)
        var lastEntryTime = entry[0]["endTime"]
        lastEntryTime = convertMilitaryTimeToTwelveHourTime(lastEntryTime)
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

class AllEntries extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            clientWorkComponentIsShowing: true,
        }
    }

    showClientWorkComponent = () => {
        this.setState({clientWorkComponentIsShowing: true})
    }

    closeClientWorkContainer = () => {
        this.setState({clientWorkComponentIsShowing: false})
    }

    renderEntries = () => {
        return this.props.allEntries.map((item, index) => {
            return <Entry key={index} showClientWorkComponent={this.showClientWorkComponent} day={item}/>
        });
    }

    render(props) {
        // if(this.props.allEntries !== undefined){console.log(this.props.allEntries)}
        return (
            <div className="allEntries">

                {this.renderEntries()}

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