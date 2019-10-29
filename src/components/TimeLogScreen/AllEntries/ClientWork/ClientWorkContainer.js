import React from 'react';
import './ClientWorkContainer.scss';
import ClientWorkDetails from './ClientWorkDetails';

import { 
    turnTimeLogStringArrayIntoArrayOfDict,
    calculateElapsedTime, 
    convertMinutesToHoursAndMinutes,
} from '../../methods/methods';


class ClientWorkContainer extends React.Component {

    constructor(props){
        super(props)
        
        this.state = {
            //pull this later on from firebase
            validProjects: ["liviawebsite", "asfamous", "dmt", "asfamouswebsite"]
        }
    }

    closeContainer = () => {
        this.props.closeClientWorkContainer()
    }

    formatClientWorkEntry = (e) => {
        var entry = e;
        var rawText = entry.rawText
        let hashtagRegex = /#[a-z-]+/gi
        let hashtags = rawText.match(hashtagRegex);
        rawText = rawText.replace(hashtagRegex, '')
        entry.rawText = rawText.trim()

        if(hashtags.length > 1){console.error('warning! clientwork hashtags lenghth is > 1 which might break your code ')}
        entry.hashtag = hashtags[0]

        var project = hashtags[0].replace(/#clientwork/, '')
        project = project.replace(/-/g, '')
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
                        //make this pull from firebase
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
            console.log('clientworkdays: ', clientWorkDays)
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
            console.log('monthArray: ', monthArray)
            //sort them by month. For now we only have entries for October.

            //calculate the total time you have spent on each project
            var totalProjectTimesArray = []
            monthArray.forEach((month) => {
                month.dailyEntries.forEach((day) => {
                    // let date = day.date
                    let projects = day.projects
                    projects.forEach((project) => {
                        if(totalProjectTimesArray.length > 0){
                            var alreadyExists = false
                            totalProjectTimesArray.forEach((tpj) => {
                                //project type already exists
                                if(tpj.title === project.title){
                                    alreadyExists = true
                                    tpj.minutesLogged += project.minutesLogged
                                    tpj.dailyEntries.push(project.entries)
                                }
                            })
                            if(!alreadyExists){
                                //this is a new project type!
                                let p = {
                                    title: project.title,
                                    minutesLogged: project.minutesLogged,
                                    dailyEntries: [project.entries]
                                    // dailyEntries: dailyEntries
                                }
                                totalProjectTimesArray.push(p)
                            }
                        } else {
                            //this is the first item in the array
                            var p = {
                                title: project.title,
                                minutesLogged: project.minutesLogged,
                                dailyEntries: [project.entries]
                                // dailyEntries: dailyEntries
                            }
                            totalProjectTimesArray.push(p)
                        }
                    })
                })
                totalProjectTimesArray.forEach((t) => {
                    let min = t.minutesLogged
                    t.timeLogged = convertMinutesToHoursAndMinutes(min)
                })
                month.totalProjectTimes = totalProjectTimesArray;
            })
            // clientWorkDays.forEach((day) => {
            //     let projects = day.projects
            //     projects.forEach((project) => {
            //         if(totalProjectTimesArray.length > 0){
            //             var alreadyExists = false
            //             totalProjectTimesArray.forEach((tpj) => {
            //                 if(tpj.title === project.title){
            //                     alreadyExists = true
            //                     tpj.minutesLogged += project.minutesLogged
            //                 }
            //             })
            //             if(!alreadyExists){
            //                 let p = {
            //                     title: project.title,
            //                     minutesLogged: project.minutesLogged
            //                 }
            //                 totalProjectTimesArray.push(p)
            //             }
            //         } else {
            //             var p = {
            //                 title: project.title,
            //                 minutesLogged: project.minutesLogged
            //             }
            //             totalProjectTimesArray.push(p)
            //         }
            //     })
            // })
            // totalProjectTimesArray.forEach((t) => {
            //     let min = t.minutesLogged
            //     t.timeLogged = convertMinutesToHoursAndMinutes(min)
            // })
            // console.log('totalProjectTimesArray: ', totalProjectTimesArray)

            

        }
    }
    
    render(props){
        this.parseAllEntries();
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
                    <ClientWorkDetails/>
                </div>
                
            </div>
        );
    }
}

export default ClientWorkContainer;