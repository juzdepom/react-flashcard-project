import React from 'react';
import './ClientWorkContainer.scss';
import ClientWorkDetails from './ClientWorkDetails';

import { 
    turnTimeLogStringArrayIntoArrayOfDict,
    calculateElapsedTime, 
    convertMinutesToHoursAndMinutes,
    formatDate,
} from '../../../methods/methods';


class ClientWorkContainer extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            //pull this later on from firebase
            validProjects: ["liviawebsite", "asfamous", "dmt", "asfamouswebsite", "elephantenglishlearning", "elephantenglish"]
        }
    }

    closeContainer = () => {
        this.props.closeClientWorkContainer()
    }

    formatClientWorkEntry = (e) => {
        var entry = e;
        //remove the clientwork hashtags from the raw text
        var rawText = entry.rawText
        let hashtagRegex = /#[a-z-]+/gi
        let hashtags = rawText.match(hashtagRegex);
        rawText = rawText.replace(hashtagRegex, '')
        entry.rawText = rawText.trim()

        //we should only have only one hashtag
        if(hashtags.length > 1){console.error('warning! clientwork hashtags lenghth is > 1 which might break your code ')}
        entry.hashtag = hashtags[0]
        
        //e.g. remove #clientwork from "#clientwork--dmt" string
        var project = hashtags[0].replace(/#clientwork/, '')
        //e.g. remove -- from "--dmt" string
        project = project.replace(/-/g, '')
        //e.g. dmt
        entry.project = project

        let elapsedInMinutes = calculateElapsedTime(entry.startTime, entry.endTime, true)
        var elapsed = {}
        elapsed.minutes = elapsedInMinutes
        elapsed.formatted = convertMinutesToHoursAndMinutes(elapsedInMinutes)
        entry.elapsed = elapsed;

        return entry;
    }

    parseAllEntries = () => {

        if(this.props.allEntries !== undefined){
            let entries = this.props.allEntries;
            var clientWorkDays = []
            
            for(var i in entries){
                var clientworkEntry = {}
                let date = entries[i]['date']
                clientworkEntry.date = date

                let text = entries[i]['rawEntry']
                if(text !== undefined){
                    let arrayOfStrings = text.split('\n')
                    let timeEntryArray = turnTimeLogStringArrayIntoArrayOfDict(arrayOfStrings)
                    
                    let clientWorkEntries = []

                    timeEntryArray.forEach((entry) => {

                        if(entry.rawText.includes('#clientwork')){
                            let clientWorkEntry = this.formatClientWorkEntry(entry)
                            clientWorkEntries.push(clientWorkEntry)
                        }
                    })

                    clientworkEntry.clientWorkEntries = clientWorkEntries

                    let projects = []
                    
                    clientWorkEntries.forEach((entry) => {
                        //make this eventually pull from firebase
                        let validProjects = this.state.validProjects
                        if(!validProjects.includes(entry.project)){
                            console.error(`doesn't match list of valid projects: ${entry.project} -> ${date}`)
                        }
                        var project = {}
                        if(projects.length > 0 ){
                            var projectAlreadyExists = false
                            projects.forEach((project, i) => {
                                //this project has already been created today
                                if(project.title === entry.project){
                                    projectAlreadyExists = true
                                    project.minutesLogged += entry.elapsed.minutes
                                    project.entries.push(entry)
                                }
                            })
                            if(!projectAlreadyExists){
                                //this project does not exist today yet!
                                project.title = entry.project
                                project.minutesLogged = entry.elapsed.minutes;
                                project.entries = [entry]
                            }
                        } else {
                            //this is the first client work entry
                            project.title = entry.project
                            project.minutesLogged = entry.elapsed.minutes;
                            project.entries = [entry]
                        }
                        
                        let timeLogged = convertMinutesToHoursAndMinutes(project.minutesLogged)
                        project.timeLogged = timeLogged
                        if(project.title !== undefined){
                            projects.push(project)
                        }
                        
                    })
                    //calculate total time logged per project
                    clientworkEntry.projects = projects
                    let totalMinutesLogged = 0
                    projects.forEach((project) => {
                        totalMinutesLogged += project.minutesLogged
                    });
                    clientworkEntry.totalMinutesLogged = totalMinutesLogged;
                    clientworkEntry.totalTimeLogged = convertMinutesToHoursAndMinutes(totalMinutesLogged)

                }
                clientWorkDays.push(clientworkEntry)
                
            }
            
            var monthArray = []

            clientWorkDays.forEach((day) => {
                //pull the month from the date value e.g. 10-21-2019
                let date = day.date
                var month = date.split("-")
                month = month[1]
                let monthText = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                //this is the first entry pushed to array
                if(monthArray.length === 0){
                    let monthEntry = {
                        monthInt: month,
                        monthText: monthText[month-1],
                        dailyEntries: [day]
                    }
                    monthArray.push(monthEntry)
                } else { //not the first entry to be pushed to array
                    var firstEntryForThisMonth = true
                    monthArray.forEach((monthEntry) => {
                        //check if month entry already exists
                        if(monthEntry.monthInt === month){
                            //month already exists
                            monthEntry.dailyEntries.push(day);
                            firstEntryForThisMonth = false
                        }
                    })
                    if(firstEntryForThisMonth){
                        //create a new entry
                        let monthEntry = {
                            monthInt: month,
                            monthText: monthText[month-1],
                            dailyEntries: [day]
                        }
                        monthArray.push(monthEntry)
                    }
                }
            })
            
            //sort them by month. For now we only have entries for October.

            //calculate the total time you have spent on each project
            
            monthArray.forEach((month, index) => {
                var monthlyTotalProjectTimesArray = []
                month.dailyEntries.forEach((day) => {
                    let date = day.date
                    let formattedDate = formatDate(date, true)
                    let projects = day.projects
                    //parse through each client work entry for the day to see what category it is
                    projects.forEach((project) => {
                        var totalTimeMinutes = 0
                        var totalTime = "H:h"
                        var compiledText = ""
                        //loop through each entry
                        project.entries.forEach((entry) => {
                            totalTimeMinutes = totalTimeMinutes + entry.elapsed.minutes
                            compiledText = compiledText + `(${entry.startTime}-${entry.endTime}) ${entry.rawText}; `
                        })
                        totalTime = convertMinutesToHoursAndMinutes(totalTimeMinutes)
                        //
                        let dailyEntry = {
                            totalTimeMinutes, 
                            totalTime, 
                            compiledText,
                            date,
                            formattedDate,
                            entries: project.entries
                        }
                        //parse through the object entries 
                        if(monthlyTotalProjectTimesArray.length > 0){
                            var alreadyExists = false
                            monthlyTotalProjectTimesArray.forEach((tpj) => {
                                //project type already exists
                                if(tpj.title === project.title){
                                    alreadyExists = true
                                    tpj.minutesLogged += project.minutesLogged
                                    tpj.dailyEntries.push(
                                        dailyEntry
                                    )
                                }
                            })
                            if(!alreadyExists){
                                //this is a new project type!
                                let p = {
                                    title: project.title,
                                    minutesLogged: project.minutesLogged,
                                    dailyEntries: [dailyEntry]
                                    // dailyEntries: [project.entries]
                                    // dailyEntries: dailyEntries
                                }
                                monthlyTotalProjectTimesArray.push(p)
                            }
                        } else {
                            //this is the first item in the array
                            var p = {
                                title: project.title,
                                minutesLogged: project.minutesLogged,
                                dailyEntries: [dailyEntry]
                                // dailyEntries: [project.entries]
                                // dailyEntries: dailyEntries
                            }
                            monthlyTotalProjectTimesArray.push(p)
                        }
                    })
                })
                monthlyTotalProjectTimesArray.forEach((t) => {
                    let min = t.minutesLogged
                    t.timeLogged = convertMinutesToHoursAndMinutes(min)
                })
                //parse through each project a
                month.projects = monthlyTotalProjectTimesArray;
            })

            // these console.logs are pretty valuable
            // console.log('clientworkdays: ', clientWorkDays)
            // console.log('monthArray: ', monthArray)

            let relevantData = {
                monthArray,
            }
            return relevantData

        }
    }
    
    render(props){
        //temporary placeholder while props is null
        // var relevantData = { monthArray: [] }

        //will return a dict with only a 'monthArray' key for now
        var relevantData = this.parseAllEntries();
        return (
            <div className="clientwork--container--main">
                <div className="clientwork--container--title">
                    <div></div>
                    <div>#clientwork</div>
                    <button
                        onClick={() => this.closeContainer()}>
                        X
                    </button>
                </div>
                <div className="clientwork--container--body">
                    <ClientWorkDetails monthArray={relevantData.monthArray}/>
                </div>
                
            </div>
        );
    }
}

export default ClientWorkContainer;