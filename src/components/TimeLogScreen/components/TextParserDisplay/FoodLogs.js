import React from 'react';
import Button from './Button';

class FoodLogs extends React.Component {

    render(){
        //will return an error if is undefined
        var title = 'Food Logs'
        var formattedText = ''
        var numberofFoodLogEntries = ''
        //props.data will temporarily be empty because we need to return the data from firebase
        if(this.props.data.length > 0){
            title = `${title} (${this.props.data.length})`
             //checks to see what date we are on e.g. 10-11-2019
            let date = this.props.date
            this.props.data.forEach((foodLogEntry) => {
                //check out parsed entries for entry for this date (we don't parse our current raw entry because I want to have the data from all the entries when we press the buttons for details)
                if(foodLogEntry.date === date){
                    formattedText = foodLogEntry.formattedText
                    numberofFoodLogEntries = `(${foodLogEntry.entries.length})`
                }
            })
        }
        return (
            <div>
                <Button click={() => this.props.open('food logs')} buttonText={title}/> 
                🍴{numberofFoodLogEntries} {formattedText}
            </div>
        )
    }
}

export default FoodLogs