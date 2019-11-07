import React from 'react';
import Button from './Button';

class IGFollowers extends React.Component {

    render(){
        var title=`IG Followers`
        //before firebase has loaded, this.props.data will be empty; numberOfEntries will return undefined
        if(this.props.data !== undefined){
            var title = `${title} (${this.props.data.numberOfEntries}`
        }
        return (
            <div>
                <Button click={() => this.props.open('igfollowers')} buttonText={title}/>
                {this.props.data.formattedText}
            </div>
        )
    }
}

export default IGFollowers