import React from 'react';
import Button from './Button';

class NewPeople extends React.Component {

    render(){
        var title=`New People`
        //before firebase has loaded, this.props.data will be empty; numberOfEntries will return undefined
        if(this.props.data !== undefined){
            title = `${title} (${this.props.data.numberOfEntries}`
        }
        return (
            <div>
                <Button click={() => this.props.open('new people')} buttonText={title}/>
                {this.props.data.formattedText}
            </div>
        )
    }
}

export default NewPeople