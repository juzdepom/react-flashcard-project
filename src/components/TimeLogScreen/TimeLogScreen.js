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
            timeLogEntries: [{
                date: "Loading...",
                rawEntry: "Loading..."
            }],
            // currentEntry: {
            //     date: "Loading...",
            //     rawEntry: "Loading...",
            // }
        }
        // this.retrieveDateFromFirebase();
        
    }

    componentWillMount(){
        this.retrieveDateFromFirebase();
    }

    retrieveDateFromFirebase = () => {
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

            this.setState({timeLogEntries})
        })
    }

    componentDidMount(){

        
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

  

    render(){
        let date = this.state.timeLogEntries[0].date
        let rawEntry = this.state.timeLogEntries[0].rawEntry
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
                        >TIME LOGGER</a>
                    </div>
                    <div className="timelog--container-secondary">

                    <div className="timelog--date">
                        <button className="timelog--date-buttons">{chevronCircleLeft}</button>
                        <span>
                            Date: {formatDate(date)}
                        </span>
                        <button className="timelog--date-buttons">{chevronCircleRight}</button>
                    </div>

                        { this.state.editModeIsOn ?  <textarea 
                            onChange={(e)=> this.updateRawEntry(e)}
                            className="timelog--input-timelog">{rawEntry}</textarea>
                            : <div className="timelog--todayslog">{formattedEntry}</div>
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