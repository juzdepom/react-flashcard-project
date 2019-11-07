import React from 'react';
import Button from './Button';

class Expenses extends React.Component {

    render(){
        var title=`Expenses`
        //before firebase has loaded, this.props.data will be empty; numberOfEntries will return undefined
        if(this.props.data !== undefined){
            title = `${title} (${this.props.data.numberOfEntries}`
        }
        return (
            <div>
                <Button click={() => this.props.open('expenses')} buttonText={title}/>
                {this.props.data.formattedText}
            </div>
        )
    }
}

export default Expenses