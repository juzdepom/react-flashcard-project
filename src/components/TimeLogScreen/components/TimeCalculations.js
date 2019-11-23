import React from 'react';
import './TimeCalculations.scss'

class TimeCalculations extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            showDetails: false,
        }
        
    }

    toggleShowDetails = () => {
        let showDetails = !this.state.showDetails
        this.setState({showDetails})
    }
    render(props){
        let { currentTime, timeUntilBedtime, bedtime, timeSinceFirstEntryTime, firstEntryTime, totalTimeAvailableToday, totalTimeLogged } = this.props
        return (
            <div>
                <button 
                    className="timecalculations--main-btn"
                    onClick={() =>this.toggleShowDetails()}>
                        Current Time: <strong>{currentTime}</strong>
                </button>
                { this.state.showDetails &&
                    <React.Fragment>
                        <br/>
                        (<strong>{timeUntilBedtime}</strong> until {bedtime}/&nbsp;{timeSinceFirstEntryTime} since {firstEntryTime})
                        <br/>
                        Time available today: <strong>{totalTimeAvailableToday}</strong> ({firstEntryTime} - {bedtime})
                    </React.Fragment>
                }
                <br/>
                <button 
                    className="timecalculations--main-btn"
                    onClick={() =>this.toggleShowDetails()}>
                        Total time logged: {totalTimeLogged}
                </button>
            </div>
        );
    }
}

export default TimeCalculations 