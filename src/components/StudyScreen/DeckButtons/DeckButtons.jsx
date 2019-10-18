import React, { Component } from 'react';
import './DeckButtons.css';

class DeckButtons extends Component {

    constructor(props){
        super(props);

    }

    deckButtons = () => {
        let { five, four, three, two, one, zero } = this.props.level; 
        let deckCountArray = [zero, one, two, three, four, five ]
        let colors = ["gray", "purple", "orange", "yellow", "green", "blue"];
        let indexArray = [0, 1, 2, 3, 4, 5]
        
        return indexArray.map(i => {
            let classname = "deckbutton " + colors[i];
            return <button 
                className={classname} 
                onClick={() => this.props.selectDeckButton(i)}>
            {deckCountArray[i]}
            </button>
        })
    }

    render(props){
        return(
            <div className="deckbuttons--container">
                <div className="deckbuttons--row">
                    {
                        this.deckButtons()
                    }
                </div>
            </div>
            
        )
    }
}

export default DeckButtons