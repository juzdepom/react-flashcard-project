import React from 'react';
import Button from './Button';

class Gratitude extends React.Component {

    render(){
        var title=`Gratitude`
        var formattedText = ''
        var numberOfGratitudeEntries = ''

        //before firebase has loaded, this.props.data will be empty; numberOfEntries will return undefined
        if(this.props.data !== undefined){
            title = `${title} (${this.props.data.length})`
            //checks to see what date we are on e.g. 10-11-2019
            let date = this.props.date
            this.props.data.forEach((gratitudeEntry) => {
                //check out parsed entries for entry for this date (we don't parse our current raw entry because I want to have the data from all the entries when we press the buttons for details)
                if(gratitudeEntry.date === date){
                    formattedText = gratitudeEntry.formattedText
                    numberOfGratitudeEntries = `(${gratitudeEntry.entries.length})`
                }
            })
        }
        return (
            <div>
                <Button click={() => this.props.open('gratitude')} buttonText={title} />
                🙏 {numberOfGratitudeEntries} {formattedText}
            </div>
        )
    }
}

export default Gratitude