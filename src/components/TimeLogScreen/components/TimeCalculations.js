import React from 'react';

class TimeCalculations extends React.Component {
    render(props){
        let { currentTime, timeUntilBedtime, bedtime, timeSinceFirstEntryTime, firstEntryTime, totalTimeAvailableToday, totalTimeLogged } = this.props
        return (
            <div>
                Current Time: <strong>{currentTime}</strong>
                <br/>
                (<strong>{timeUntilBedtime}</strong> until {bedtime}/&nbsp;{timeSinceFirstEntryTime} since {firstEntryTime})
                <br/>
                Time available today: <strong>{totalTimeAvailableToday}</strong> ({firstEntryTime} - {bedtime})
                <br/>
                Total time logged: {totalTimeLogged}
            </div>
        );
    }
}

export default TimeCalculations 