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

    render(){
        return (
            <div className="projectdetails--container">
                <div className="projectdetails--title-container">
                    <div></div>
                    <div>#asfamous project Details</div>
                    <button onClick={() => this.close()}>X</button>
                </div>
                <div className="projectdetails--body-container">
                    <div>Sunday, Oct 28: 25 min : blablablalbalblabla</div>
                    <div>Saturday, Oct 27: 25min: blalbalbalbal</div>
                </div>
                
            </div>
        );
    }
}

class MonthlyClientWork extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            showProjectDetails: false,
        }
    }

    clickedProject = () => {
        this.setState({showProjectDetails: true})
    }

    closeProjectDetails = () => {
        this.setState({showProjectDetails: false})
    }
    render() {
        return (
            <div className="cwd--details-container">
                <button className="cwd--navigation-btn">{chevronCircleLeft}</button>
                October
                <button className="cwd--navigation-btn">{chevronCircleRight}</button>
                <br/>
               Total Working Hours Logged: 120 hours.<br/><br/>
               <button onClick={()=> this.clickedProject()}>A's Famous Social Media: 50 hours </button><br/>
               A's Famous Website Work: 10 hours <br/>
               Diamond Muay Thai Social Media: 10 hours <br/>
               Livia Website Work <br/>
               { this.state.showProjectDetails &&
                    <ProjectDetails closeProjectDetails={this.closeProjectDetails}/>
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
        return (
            <div className="cwd--container">
                <button className="cwd--monthweek-btn" onClick={() => this.displayMonthlyData()}>Month</button>
                <button className="cwd--monthweek-btn" onClick={() => this.displayWeeklyData()}>Week</button>
                { this.state.displayMonthlyData ?
                    <MonthlyClientWork/>
                : <WeeklyClientWork/> }
            </div>
        )
    }
}

export default ClientWorkDetails