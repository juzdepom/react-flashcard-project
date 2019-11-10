import React from 'react';
import Button from './Button';

class Weight extends React.Component {

    render(){
        var title =`Weight`
        var formattedText = 'empty'
         //before firebase has loaded, this.props.data will be empty; numberOfEntries will return undefined
        if(this.props.data !== undefined){
            //we want to count by the number of days where you entered weight entries
            var title = `${title} (${this.props.data.length})`
            //checks to see what date we are on e.g. 10-11-2019
            let date = this.props.date
            this.props.data.forEach((weightEntry) => {
                //check out parsed entries for entry for this date (we don't parse our current raw entry because I want to have the data from all the entries when we press the buttons for details)
                if(weightEntry.date === date){
                    formattedText = weightEntry.formattedText
                }
            })
        }
        //UGHH. so for the text it just occurred to me that we need to look to see if there is one of the entries that matches the current date we are on.
        //we need it to take in a prop to match the date that is showing

        return (
            <div>
                <Button click={() => this.props.open('weight')} buttonText={title}/>
                ⚖️ {formattedText}
            </div>
        )
    }
}

export default Weight