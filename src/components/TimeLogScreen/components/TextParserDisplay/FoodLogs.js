import React from 'react';
import Button from './Button';

class FoodLogs extends React.Component {

    render(){
        //will return an error if is undefined
        var title = 'Food Logs'
        var formattedText = ''
        //props.data will temporarily be empty because we need to return the data from firebase
        if(this.props.data.length > 0){
            title = `${title} (${this.props.data[0].entries.length})`
            formattedText = this.props.data[0].formattedText
        }
        return (
            <div>
                <Button click={() => this.props.open('food logs')} buttonText={title}/> 
                🍴 {formattedText}
            </div>
        )
    }
}

export default FoodLogs