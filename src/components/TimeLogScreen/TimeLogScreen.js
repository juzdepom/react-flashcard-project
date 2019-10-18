import React from 'react';
import './TimeLogScreen.scss';

//methods
import { getCurrentDate, formatDate } from './methods/methods';

//firebase
import { PERSONALDATA_DB_CONFIG } from '../../config/personalData-config';
import firebase from 'firebase/app';
import 'firebase/database'; 

//button text
let noInputDataText = "No input data yet"

class TimeLogScreen extends React.Component {

    constructor(props){
        super(props)

         //if you don't include the "if statement" an error might occur
        if (!firebase.apps.length) {
            alert('initializing app with personal data db config!')
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

    render(){
        let date = this.state.timeLogEntries[0].date
        let rawEntry = this.state.timeLogEntries[0].rawEntry
        return (
            <div className="timelog">
                <div className="timelog--container-main">
                    <div className="timelog--title">TIME LOGGER</div>
                    <div className="timelog--container-secondary">
                    <div className="timelog--date">Date: {formatDate(date)}</div>
                        { this.state.editModeIsOn ?  <textarea 
                            onChange={(e)=> this.updateRawEntry(e)}
                            className="timelog--input-timelog">{this.state.timeLogEntries[0].rawEntry}</textarea>
                            : <div className="timelog--todayslog"><p>{this.state.timeLogEntries[0].rawEntry}</p></div>
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