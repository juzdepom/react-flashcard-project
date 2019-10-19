import React from 'react';
import './TimeLogScreen.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'

//methods
import { 
    getCurrentDate, 
    formatDate, 
    calculateElapsedTime,
    turnTimeLogStringArrayIntoArrayOfDict,
    returnBackgroundTypeBasedOnHashtag,
    convertMinutesToHoursAndMinutes,
    convertMilitaryTimeToTwelveHourTime } from './methods/methods';

//firebase
import { PERSONALDATA_DB_CONFIG } from '../../config/personalData-config';
import firebase from 'firebase/app';
import 'firebase/database'; 

//button text
let noInputDataText = "No input data yet"

//fontawesome
const chevronCircleLeft = <FontAwesomeIcon icon={faChevronCircleLeft} />
const chevronCircleRight = <FontAwesomeIcon icon={faChevronCircleRight} />

class TimeLogScreen extends React.Component {

    constructor(props){
        super(props)

         //if you don't include the "if statement" an error might occur
        if (!firebase.apps.length) {
            // alert('initializing app with personal data db config!')
            firebase.initializeApp(PERSONALDATA_DB_CONFIG);
        }

        this.state = {
            editModeIsOn: false,
            buttonText: "Edit",
            //this are to enable/disable the forward/backward buttons
            entryIndex: 0,
            doesNotHavePrevEntries: true,
            doesNotHaveFutureEntries: true,
            
            timeLogEntries: [{
                date: "Loading...",
                rawEntry: "Loading..."
            }],

            entryData: [],
            hashtagData: []
        }
        
    }

    componentWillMount(){
        this.retrieveDataFromFirebase();
    }

    retrieveDataFromFirebase = () => {
        //will return dd-mm-yyyy format
        let currentDate = getCurrentDate()
        var currentEntry = {}
        var timeLogEntries = []

         // retrieving the data from firebase
        const database = firebase.database()
        database.ref('timelogs').on("value", (snapshot) => {
            timeLogEntries = snapshot.val()
            //will return null if no entry has every been created yet
            
            if(timeLogEntries != null){
                this.setState({timeLogEntries}, () => {
                    //loop through entries to see if we already have an entry for today
                    var entryForThisTodayDoesNotExist = true;
                    for(var i in timeLogEntries){
                        if(timeLogEntries[i].date == currentDate){
                            //entry for today already exists
                            currentEntry = timeLogEntries[i]
                            entryForThisTodayDoesNotExist = false
                        }
                    }
                    if(entryForThisTodayDoesNotExist){
                        alert('today is a new day!')
                        currentEntry = {
                            date: currentDate,
                            rawEntry: noInputDataText
                        }
                        timeLogEntries.unshift(currentEntry)
                    }
                })
            } else { 
                alert("time log entries from firebase is null")
                currentEntry = {
                    date: currentDate,
                    rawEntry: noInputDataText
                }
                timeLogEntries = this.state.timeLogEntries
                timeLogEntries[0] = currentEntry;
            }
            var doesNotHavePrevEntries = true;
            if(timeLogEntries.length > 1){
                doesNotHavePrevEntries = false; 
            }

            this.setState({timeLogEntries, doesNotHavePrevEntries}, () => {
                this.parseCurrentEntryRawText()
            })
        })
    }


    parseCurrentEntryRawText = () => {
        let entry = this.state.timeLogEntries[this.state.entryIndex].rawEntry
        let arrayOfStrings = entry.split('\n')
        let entryData = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)
        
        // var hashtagEntry
        var hashtagDataDict = {}
        for(var i in entryData){
            let item = entryData[i]
            let rawText = item["rawText"]

            let hashtagRegex = /#[a-z]+/gi
            let hashtags = rawText.match(hashtagRegex);

            var startTime = item["startTime"]
            var endTime = item["endTime"]
            let elapsedTime = calculateElapsedTime(startTime, endTime, true)

            if(hashtagDataDict[hashtags] == undefined){hashtagDataDict[hashtags] = 0}
            hashtagDataDict[hashtags] = parseInt(hashtagDataDict[hashtags]) + parseInt(elapsedTime);
        }

        var hashtagData = []
        for(var key in hashtagDataDict){
            var hashtagDict = {}
            hashtagDict["hashtag"] = key
            hashtagDict["time"] = hashtagDataDict[key]
            hashtagData.push(hashtagDict)
        }

        this.setState({hashtagData, entryData})
    }

    switchEditMode = () => {
        let editModeIsOn = !this.state.editModeIsOn
        let buttonText = (editModeIsOn) ? "Save" : "Edit"
        this.setState({editModeIsOn, buttonText})
        //edit mode has just been turned off, which means we are saving
        if (!editModeIsOn) {
            this.saveTimeLogEntriesInFirebase()
        }
    }

    updateRawEntry = (e) => {
        let text = e.target.value
        var timeLogEntries = this.state.timeLogEntries
        timeLogEntries[0].rawEntry = text
        this.setState({timeLogEntries})
    }

    saveTimeLogEntriesInFirebase = () => {
        var entries = this.state.timeLogEntries
        firebase.database().ref('timelogs').set(entries)
    }

    //format timelog raw data
    formatEntry = (entry) => {
        let arrayOfStrings = entry.split('\n')
        if(arrayOfStrings.length < 2){return entry}

        let arrayOfDict = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)

        let newText = arrayOfDict.map((item, i) => {
            var startTime = item["startTime"]
            var endTime = item["endTime"]
            let elapsedTime = calculateElapsedTime(startTime, endTime)
            let rawText = item["rawText"]

            startTime = convertMilitaryTimeToTwelveHourTime(startTime)
            endTime = convertMilitaryTimeToTwelveHourTime(endTime)
            
            let hashtagRegex = /#[a-z-]+/gi
            let hashtags = rawText.match(hashtagRegex);
            let textWithoutHashtags = rawText.replace(hashtagRegex, "");

            let backgroundType = returnBackgroundTypeBasedOnHashtag(hashtags)
            // let backgroundType = "default"
            let className = "timelog--todayslog--entry bg-"+ backgroundType
            // let className = "timelog--todayslog--entry bg-default"

            return(
            <div 
                key={i} 
                className={className}>
                <p>
                    <strong>{startTime} - {endTime} ({elapsedTime})</strong>
                    <span className="timelog--todayslog--entry-hashtags">
                    {hashtags}
                    </span>
                    <span className="timelog--todayslog--entry-caption">
                    {textWithoutHashtags}
                    </span>
                    </p>
                {/* <p>{textWithoutHashtags}</p> */}
            </div>
            );
        })

        return newText
    }

    changeEntries = (i) => {
        var doesNotHavePrevEntries = this.state.doesNotHavePrevEntries
        var doesNotHaveFutureEntries = this.state.doesNotHaveFutureEntries
        var entryIndex = this.state.entryIndex + i

        let entries = this.state.timeLogEntries
        //we are at the last index can't go back anymore
        if(entryIndex === entries.length - 1){
            doesNotHavePrevEntries = true;
        } else {
            doesNotHavePrevEntries = false;
        }
        if(entryIndex === 0){
            doesNotHaveFutureEntries = true;
        } else {
            if(entries.length > 1){
                doesNotHaveFutureEntries = false;
            }
        }

        //this shoudn't happen but just in case...
        if(entryIndex > entries.length - 1 || entryIndex < 0){
            entryIndex = entryIndex - i;
            alert(`Error! changeEntries() entryIndex=${entryIndex} i=${i}`)
        }

        this.setState({entryIndex, doesNotHavePrevEntries,doesNotHaveFutureEntries})
    }

    returnFormattedHashtagData = () => {
        let hashtagData = this.state.hashtagData
        var formattedHashtagData = ''
        //hasen't parsed the data from firebase yet
        if(hashtagData.length === 0){
            return formattedHashtagData
        }

        formattedHashtagData = hashtagData.map((item, i) => {
            let hashtag = item["hashtag"]
            let time = convertMinutesToHoursAndMinutes(item["time"])
            // console.log(item)
            let backgroundType = returnBackgroundTypeBasedOnHashtag(hashtag)
            let className = "bg-"+backgroundType
            return(
                <span className={className}>{hashtag}: {time}</span>
            )
            
        })
        return formattedHashtagData;
    }

    render(){
        let index = this.state.entryIndex
        let date = this.state.timeLogEntries[index].date
        let rawEntry = this.state.timeLogEntries[index].rawEntry
        let hashtagData = this.returnFormattedHashtagData()
        var formattedEntry = rawEntry
        if (!this.state.editModeIsOn){
            formattedEntry = this.formatEntry(rawEntry)
        }
        return (
            <div className="timelog">
                <div className="timelog--container-main">
                    <div className="timelog--title">
                        <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            href="https://console.firebase.google.com/u/0/project/personal-data-tracking-project/database/personal-data-tracking-project/data"
                        >TIME LOGGER {this.state.entryIndex}</a>
                    </div>
                    <div className="timelog--container-secondary">

                    <div className="timelog--date">
                        <button 
                            onClick={() => this.changeEntries(1)}
                            disabled={this.state.doesNotHavePrevEntries}
                            className="timelog--date-buttons">{chevronCircleLeft}</button>
                        <span>
                            Date: {formatDate(date)}
                        </span>
                        <button 
                            onClick={() => this.changeEntries(-1)}
                            disabled={this.state.doesNotHaveFutureEntries}
                            className="timelog--date-buttons">{chevronCircleRight}</button>
                    </div>

                        { this.state.editModeIsOn ?  <textarea 
                                    onChange={(e)=> this.updateRawEntry(e)}
                                    className="timelog--input-timelog">{rawEntry}
                                </textarea>
                            : <div>
                                <div className="timelog--todayslog">
                                {formattedEntry}
                                </div>
                                <div className="timelog--todayslog--hashtag-data-container">
                                    {hashtagData}
                                </div>
                            </div>
                        }
                        
                        <div className="timelog--container-button-edit">
                            <button 
                                onClick={() => this.switchEditMode()}
                                className="timelog--button-edit">
                                {this.state.buttonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default TimeLogScreen;