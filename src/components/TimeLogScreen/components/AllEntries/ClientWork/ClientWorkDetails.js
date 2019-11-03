import React from 'react';
import './ClientWorkDetails.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
//fontawesome
const chevronCircleLeft = <FontAwesomeIcon icon={faChevronCircleLeft} />
const chevronCircleRight = <FontAwesomeIcon icon={faChevronCircleRight} />

class ProjectDetails extends React.Component {

    close = () => {
        this.props.closeProjectDetails()
    }
    renderWorkBreakdown(entries){
        if(entries.length === 0){ console.error(`Error! entries array is empty. This should not be possible: ${entries}`)}
        return entries.map((entry, index) => {
            return <div key={index}>
                <strong>{entry.formattedDate}</strong>: {entry.totalTime} : <span style={{fontSize: "12px"}}>{entry.compiledText}</span>
            </div>
        });
    }
    render(){
        let { title, timeLogged, dailyEntries } = this.props.project
        return (
            <div className="projectdetails--container">
                <div className="projectdetails--title-container">
                    <div></div>
                    <div>#{title} {timeLogged} breakdown</div>
                    <button onClick={() => this.close()}>X</button>
                </div>
                <div className="projectdetails--body-container">
                    { this.renderWorkBreakdown(dailyEntries)}
                </div>
                
            </div>
        );
    }
}

class MonthlyClientWork extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            monthIndex:0,
            //these should both be automatically set to true
            //and then we should determine from the data whether they are okay or not
            doesNotHaveFutureEntries: true,
            doesNotHavePrevEntries: false,
            project: {
                dailyEntries: [],
                minutesLogged: '',
                timeLogged: '',
                title: '',
            },
            showProjectDetails: false,
        }
    }

    clickedProject = (project) => {
        // console.log('clicked project: ', project)
        this.setState({project, showProjectDetails: true})
    }

    changeMonth = (i) => {
        //if we are trying to go to index[-1], that will crash the application
        if(this.state.monthIndex === 0 && i < 0){
            this.setState({doesNotHaveFutureEntries: true})
        }

        var doesNotHavePrevEntries = this.state.doesNotHavePrevEntries
        var doesNotHaveFutureEntries = this.state.doesNotHaveFutureEntries
        var monthIndex = this.state.monthIndex + i

        let entries = this.props.monthArray
        //we are at the last index can't go back anymore
        if(monthIndex === entries.length - 1){
            doesNotHavePrevEntries = true;
        } else {
            doesNotHavePrevEntries = false;
        }
        if(monthIndex === 0){
            doesNotHaveFutureEntries = true;
        } else {
            if(entries.length > 1){
                doesNotHaveFutureEntries = false;
            }
        }

        this.setState({monthIndex, doesNotHaveFutureEntries, doesNotHavePrevEntries})
        
    }

    closeProjectDetails = () => {
        this.setState({showProjectDetails: false})
    }

    renderClientWorkHoursForTheMonth = (projects) => {
        if(projects.length > 0){
            return projects.map((project, index) => {
                // console.log('project: ', project)
                return <div key={index}>
                        <button 
                        className="cwd--navigation-btn"
                        onClick={()=> this.clickedProject(project)}
                        >
                            #{project.title} : {project.timeLogged}
                        </button>
                    </div>
            });
        } else {
            return ''
        }
    }
    render() {
        var monthEntry = []
        var monthText = "loading..."
        var projects = []
        if(this.props.monthArray.length > 0){
            monthEntry = this.props.monthArray[this.state.monthIndex]
            monthText = monthEntry.monthText
            projects = monthEntry.projects
        }
        // console.log('monthArray: ', this.props.monthArray)
        return (
            <div className="cwd--details-container">
                <button 
                    onClick={()=>this.changeMonth(1)}
                    disabled={this.state.doesNotHavePrevEntries}
                    className="cwd--navigation-btn">{chevronCircleLeft}</button>
                {monthText}
                <button 
                    onClick={()=>this.changeMonth(-1)}
                    disabled={this.state.doesNotHaveFutureEntries}
                    className="cwd--navigation-btn">{chevronCircleRight}</button>
                <br/>
               Total Working Hours Logged: XX hours.<br/><br/>
                {
                    this.renderClientWorkHoursForTheMonth(projects)
                }
               { this.state.showProjectDetails &&
                    <ProjectDetails project={this.state.project} closeProjectDetails={this.closeProjectDetails}/>
               }
            </div>
        )
    }
}

class WeeklyClientWork extends React.Component {
    render() {
        return (
            <div className="cwd--details-container" >
                 <button className="cwd--navigation-btn">{chevronCircleLeft}</button>
                Monday-Sun (Oct 21 - Oct 28, 2019)
                <button className="cwd--navigation-btn">{chevronCircleRight}</button>
                <br/>
                Total Working Hours Logged: 120 hours.<br/><br/>
                <button>A's Famous Social Media: 50 hours</button>  <br/>
                A's Famous Website Work: 10 hours <br/>
                Diamond Muay Thai Social Media: 10 hours <br/>
                Livia Website Work: <br/>
            </div>
        )
    }
}

class ClientWorkDetails extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            displayMonthlyData: true
        }
    }
    displayMonthlyData = () => {
        this.setState({displayMonthlyData: true})
    }
    displayWeeklyData = () => {
        this.setState({displayMonthlyData: false})
    }
    render(){
        // console.log('monthArray: ', this.props.monthArray)
        return (
            <div className="cwd--container">
                <button className="cwd--monthweek-btn" onClick={() => this.displayMonthlyData()}>Month</button>
                <button className="cwd--monthweek-btn" onClick={() => this.displayWeeklyData()}>Week</button>
                { this.state.displayMonthlyData ?
                    <MonthlyClientWork monthArray={this.props.monthArray}/>
                : <WeeklyClientWork/> }
            </div>
        )
    }
}

export default ClientWorkDetails