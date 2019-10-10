import React from 'react';
import './DeckList.scss';

class DeckList extends React.Component {

    constructor(props){
        super(props)
    }

    render(){
        return (
            <div className={this.props.deckListClassname} style={{display: this.props.deckListDisplay}}>
                <button 
                    className="decklist--close-button"
                    onClick={()=> this.props.close()}>
                    Close
                </button>
            </div>
        );
    }

}

export default DeckList;