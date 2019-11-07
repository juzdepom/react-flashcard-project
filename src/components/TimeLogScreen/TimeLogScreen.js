import React from 'react';
//sass
import './TimeLogScreen.scss';
//components
import { 
    AllEntries,
    TimeCalculations,
    EditTextContainer, 
    EntryDisplay, 
    ButtonContainer,
    HashtagDataDisplay } from './components'
import {
    Weight,
    LearnedSthNew,
    Expenses,
    FoodLogs,
    Gratitude,
    Habits,
    IGFollowers,
    NewPeople, 
    ParsedTextDetails,
} from './components/TextParserDisplay'
//methods
import { 
    parseAllEntriesForRelevantData,
} from './methods/parseTextMethods'
import { 
    getCurrentDate, 
    formatDate, 
    calculateElapsedTime,
    turnTimeLogStringArrayIntoArrayOfDict,
    returnBackgroundTypeBasedOnHashtag,
    returnHeightTypeBasedOnTime,
    convertMinutesToHoursAndMinutes,
    parseEntryDataArrayIntoHashtagArray,
    getCurrentTime,
    convertMilitaryTimeToTwelveHourTime,
    calculateTotalTimeLoggedFromEntryData, 
    } from './methods/methods';
//firebase
import { PERSONALDATA_DB_CONFIG } from '../../config/personalData-config';
import firebase from 'firebase/app';
import 'firebase/database'; 
//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
const chevronCircleLeft = <FontAwesomeIcon icon={faChevronCircleLeft} />
const chevronCircleRight = <FontAwesomeIcon icon={faChevronCircleRight} />
//button text
let noInputDataText = "No input data yet"

class TimeLogScreen extends React.Component {

    constructor(props){
        super(props)

         //if you don't include the "if statement" an error might occur
        if (!firebase.apps.length) {
            // alert('initializing app with personal data db config!')
            firebase.initializeApp(PERSONALDATA_DB_CONFIG);
        }

        this.state = {
            allEntriesModeIsOn: false,
            editModeIsOn: false,
            parsedTextDetailsIsOn: false,
            objectivesAreShowing: false,
            parsedTextDetails: {},
            switchEditButtonText: "Edit",
            goalsForTheDayButtonText: "Goals For The Day",

            //this are to enable/disable the forward/backward buttons
            entryIndex: 0,
            doesNotHavePrevEntries: true,
            doesNotHaveFutureEntries: true,
            
            timeLogEntries: [{
                date: "Loading...",
                rawEntry: "Loading...",
                objectives: "Loading...",
            }],

            entryData: [],
            hashtagData: [],

            hashtagDataIncludesDash: false,

            firstEntryTime: NaN,
            timeSinceFirstEntryTime: NaN,
            totalTimeAvailableToday: NaN,
            totalTimeLogged: NaN,
            
            militaryBedTime: "22:00",
        }
        
    }

    componentDidMount(){
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
                        if(timeLogEntries[i].date === currentDate){
                            //entry for today already exists
                            currentEntry = timeLogEntries[i]
                            entryForThisTodayDoesNotExist = false
                        }
                    }
                    if(entryForThisTodayDoesNotExist){
                        alert('today is a new day!')
                        currentEntry = {
                            date: currentDate,
                            rawEntry: noInputDataText,
                            objectives: "No objectives written yet"
                        }
                        timeLogEntries.unshift(currentEntry)
                    }
                })
            } else { 
                alert("time log entries from firebase is null")
                currentEntry = {
                    date: currentDate,
                    rawEntry: noInputDataText,
                    objectives: "No objectives written yet",
                }
                timeLogEntries = this.state.timeLogEntries
                timeLogEntries[0] = currentEntry;
            }
            var doesNotHavePrevEntries = true;
            if(timeLogEntries.length > 1){
                doesNotHavePrevEntries = false; 
            }

            this.setState({timeLogEntries, doesNotHavePrevEntries}, () => {
                //get such information as hashtag data, first entry time data, and more...
                this.parseCurrentEntryRawText()
                //search the entries raw text for habit logs, food logs, expense logs, etc..
                //for the moment we are just logging to console
                // parseAllEntriesForRelevantData(this.state.timeLogEntries)
            })
        })
    }

    switchEntriesDisplayMode = () => {
        let allEntriesModeIsOn = !(this.state.allEntriesModeIsOn)
        this.setState({allEntriesModeIsOn})
    }

    switchHashtagDataStyle = () => {
        let hashtagDataIncludesDash = !(this.state.hashtagDataIncludesDash)
        this.setState({hashtagDataIncludesDash}, () => {
            this.parseCurrentEntryRawText()
        })
    }

    //get the hashtagData, entryData, firstEntryTime, totalTimeAvailableToday, totalTimeLogged, timeSinceFirstEntryTime...
    parseCurrentEntryRawText = () => {
        var firstEntryTime = NaN;
        var totalTimeAvailableToday = NaN;
        var totalTimeLogged = NaN;
        var timeSinceFirstEntryTime = NaN;
        let entry = this.state.timeLogEntries[this.state.entryIndex].rawEntry
        let arrayOfStrings = entry.split('\n')
        
        let entryData = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)

        if(entryData.length > 0){
            let currentTime = getCurrentTime()
            totalTimeLogged = calculateTotalTimeLoggedFromEntryData(entryData)
            firstEntryTime = entryData[entryData.length-1]["startTime"]
            timeSinceFirstEntryTime = calculateElapsedTime(firstEntryTime, currentTime)
            totalTimeAvailableToday = calculateElapsedTime(firstEntryTime, this.state.militaryBedTime)
            firstEntryTime = convertMilitaryTimeToTwelveHourTime(firstEntryTime)
        }
        
        let hashtagData = parseEntryDataArrayIntoHashtagArray(entryData, this.state.hashtagDataIncludesDash)
        
        this.setState({hashtagData, entryData, firstEntryTime, totalTimeAvailableToday, totalTimeLogged, timeSinceFirstEntryTime})
    }

    switchObjectivesMode = () => {
        let objectivesAreShowing = !this.state.objectivesAreShowing
        let goalsForTheDayButtonText = (objectivesAreShowing) ? "Save" : "Goals For The Day"
        this.setState({objectivesAreShowing, goalsForTheDayButtonText})
        if(!objectivesAreShowing){
            console.log('saving entries in firebase')
            this.saveTimeLogEntriesInFirebase()
        }
    }

    switchEditMode = () => {
        let editModeIsOn = !this.state.editModeIsOn
        let switchEditButtonText = (editModeIsOn) ? "Save" : "Edit"
        this.setState({editModeIsOn, switchEditButtonText})
        //edit mode has just been turned off, which means we are saving
        if (!editModeIsOn) {
            this.saveTimeLogEntriesInFirebase()
        }
    }

    updateRawEntry = (e) => {
        let text = e.target.value
        var timeLogEntries = this.state.timeLogEntries
        timeLogEntries[this.state.entryIndex].rawEntry = text
        this.setState({timeLogEntries})

        //search the entries raw text for habit logs, food logs, expense logs, etc..
        //for the moment we are just logging to console
        // parseAllEntriesForRelevantData(this.state.timeLogEntries)
    }

    updateObjectives = (e) => {
        let text = e.target.value
        var timeLogEntries = this.state.timeLogEntries
        //might be good to combines updateObjectives and updateRawEntry in the future
        timeLogEntries[this.state.entryIndex].objectives = text
        this.setState({timeLogEntries})
        // console.log('updating objectives: ', this.state.timeLogEntries)

    }

    saveTimeLogEntriesInFirebase = () => {
        var entries = this.state.timeLogEntries
        firebase.database().ref('timelogs').set(entries)
    }

    //navigate between entry date
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

        this.setState({entryIndex, doesNotHavePrevEntries,doesNotHaveFutureEntries}, () => {
            this.parseCurrentEntryRawText()
        })
    }

    //format timelog raw data
    formatEntry = (entry) => {
        let arrayOfStrings = entry.split('\n')
        if(arrayOfStrings.length < 2){return entry}

        //have already ensured that the array of strings is longer than 1
        let arrayOfDict = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)

        let newText = arrayOfDict.map((item, i) => {
            //format the time
            var startTime = item["startTime"]
            var endTime = item["endTime"]
            let e = calculateElapsedTime(startTime, endTime, true)
            //e.g. 78 -> 1h18
            let elapsedTime = convertMinutesToHoursAndMinutes(e)
            //e.g. 18:00 -> 6:00 PM
            startTime = convertMilitaryTimeToTwelveHourTime(startTime)
            endTime = convertMilitaryTimeToTwelveHourTime(endTime)
            
            //extract the raw text
            let rawText = item["rawText"]

            //parse out the hashtags including the text in the raw entry
            let hashtagRegex = /#[a-z-]+/gi
            let hashtags = rawText.match(hashtagRegex);

            //take out the hashtags
            var textWithoutHashtags = rawText.replace(hashtagRegex, "");

            //replace the special characters with emojis for slightly better visuals
            textWithoutHashtags = textWithoutHashtags.replace("f&", "🍴")
            textWithoutHashtags = textWithoutHashtags.replace("&f", "🍴")
            textWithoutHashtags = textWithoutHashtags.replace("$&", "💵")
            textWithoutHashtags = textWithoutHashtags.replace("&$", "💵")
            textWithoutHashtags = textWithoutHashtags.replace("h&", "✅")
            textWithoutHashtags = textWithoutHashtags.replace("&h", "✅")
            textWithoutHashtags = textWithoutHashtags.replace("w&", "⚖️")
            textWithoutHashtags = textWithoutHashtags.replace("&w", "⚖️")
            textWithoutHashtags = textWithoutHashtags.replace("g&", "🙏")
            textWithoutHashtags = textWithoutHashtags.replace("&g", "🙏")
            textWithoutHashtags = textWithoutHashtags.replace("lsn&", "👩🏻‍🏫")
            textWithoutHashtags = textWithoutHashtags.replace("&lsn", "👩🏻‍🏫")

            //return the background color based on the hashtag
            let backgroundType = returnBackgroundTypeBasedOnHashtag(hashtags)

            //e.g. an entry that is longer than 
            let height = returnHeightTypeBasedOnTime(e)

            //customize the height based off of this data
            let className = `timelog--todayslog--entry bg-${backgroundType} height-${height}`

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
            </div>
            );
        })

        return newText
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
                <div key={i} className={className}>{hashtag}: {time}</div>
            )
            
        })
        return formattedHashtagData;
    }

    openParsedTextDetails = (title) => {
        let parsedTextDetails = {title}
        this.setState({parsedTextDetailsIsOn: true, parsedTextDetails})
        // alert(`opening ${title}`)
    }

    closeParsedTextDetails = () => {
        let parsedTextDetails = {}
        this.setState({parsedTextDetailsIsOn: false, parsedTextDetails})
    }

    render(){
        let index = this.state.entryIndex
        let date = this.state.timeLogEntries[index].date
        let rawEntry = this.state.timeLogEntries[index].rawEntry
        var objectives = this.state.timeLogEntries[index].objectives
        if(objectives === undefined){ objectives = "No objectives written for today yet"}
        
        let hashtagData = this.returnFormattedHashtagData()
        var formattedEntry = rawEntry
        if (!this.state.editModeIsOn){
            formattedEntry = this.formatEntry(rawEntry)
        }

        //gather the data for our TextParserDisplay components!
        if(!this.state.editModeIsOn){
            var { habits, 
                gratitude,
                foodlogs,
                expenses,
                learned,
                newpeople,
                igfollowers,
                weight,
             } = parseAllEntriesForRelevantData(this.state.timeLogEntries)
        } 
        

        let { 
            totalTimeAvailableToday, 
            firstEntryTime, 
            totalTimeLogged, 
            timeSinceFirstEntryTime,
            militaryBedTime,} = this.state
        //small problem: this returns a static time; will only update if you reload the page
        var currentTime = getCurrentTime() 
        var timeUntilBedtime = calculateElapsedTime(currentTime, militaryBedTime)
        currentTime = convertMilitaryTimeToTwelveHourTime(currentTime)
        var bedtime = convertMilitaryTimeToTwelveHourTime(militaryBedTime)

        return (
            <div className="timelog">
                <div className="timelog--container-main">

                    <div className="timelog--title">
                        <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            href="https://console.firebase.google.com/u/0/project/personal-data-tracking-project/database/personal-data-tracking-project/data"
                        >TIME LOGGER</a> {this.state.entryIndex}&nbsp;
                        <button>VISION BOARD</button>
                    </div>
                    <div className="timelog--container-secondary">

                    <div className="timelog--date">
                        <button 
                            onClick={() => this.changeEntries(1)}
                            disabled={this.state.doesNotHavePrevEntries}
                            className="timelog--date-buttons">{chevronCircleLeft}
                        </button>
                        <button onClick={() => this.switchEntriesDisplayMode()}>
                            Date: {formatDate(date)}
                        </button>
                        <button 
                            onClick={() => this.changeEntries(-1)}
                            disabled={this.state.doesNotHaveFutureEntries}
                            className="timelog--date-buttons">{chevronCircleRight}
                        </button>
                    </div>
                    
                    { !this.state.allEntriesModeIsOn ?
                    
                    <div className="timelog--entry">
                        <TimeCalculations 
                            currentTime = {currentTime}
                            timeUntilBedtime = {timeUntilBedtime} 
                            bedtime = {bedtime}
                            timeSinceFirstEntryTime = {timeSinceFirstEntryTime}
                            firstEntryTime = {firstEntryTime}
                            totalTimeAvailableToday = {totalTimeAvailableToday}
                            totalTimeLogged = {totalTimeLogged}
                        />

                        <ButtonContainer switchEditMode={this.switchEditMode}
                            switchObjectivesMode={this.switchObjectivesMode}
                            goalsForTheDayButtonText={this.state.goalsForTheDayButtonText}
                            switchEditButtonText={this.state.switchEditButtonText}/>
                        { !this.state.objectivesAreShowing ? 
                            <div>
                                { this.state.editModeIsOn ?  
                                    <EditTextContainer
                                        update = {this.updateRawEntry}
                                        text = {rawEntry} />
                                : //we are not editting the current entry
                                    <div> 
                                        <EntryDisplay 
                                            formattedEntry = {formattedEntry} />
                                        <HashtagDataDisplay
                                            switchHashtagDataStyle = { this.switchHashtagDataStyle}
                                            hashtagData = {hashtagData} />
                                    </div>
                                }
                            </div> : //display objectives
                         <EditTextContainer
                                update={this.updateObjectives}
                                text={objectives}
                            /> }
                        { !this.state.editModeIsOn &&
                            <div className="timelog--textparserdisplay">
                            <Habits open={this.openParsedTextDetails} data={habits}/>
                            <Gratitude open={this.openParsedTextDetails} data={gratitude}/>
                            <FoodLogs open={this.openParsedTextDetails} data={foodlogs}/>
                            <Expenses open={this.openParsedTextDetails} data={expenses}/>
                            <LearnedSthNew open={this.openParsedTextDetails} data={learned}/>
                            <NewPeople open={this.openParsedTextDetails} data={newpeople}/>
                            <IGFollowers open={this.openParsedTextDetails} data={igfollowers}/>
                            <Weight open={this.openParsedTextDetails} data={weight}/>
                            {
                                this.state.parsedTextDetailsIsOn && <ParsedTextDetails close={this.closeParsedTextDetails} data={this.state.parsedTextDetails}/>
                            }
                        </div>
                        }
                    </div> : // display all entries
                    <AllEntries 
                        allEntries={this.state.timeLogEntries}/> }
                    </div>
                </div>
            </div>
        );
    }

}

export default TimeLogScreen;