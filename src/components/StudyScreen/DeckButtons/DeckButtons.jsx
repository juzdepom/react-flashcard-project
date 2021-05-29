import React, { Component } from 'react';
import './DeckButtons.css';

class DeckButtons extends Component {

    // constructor(props){
    //     super(props);

    // }

    deckButtons = () => {
        let { five, four, three, two, one, zero } = this.props.level; 
        let deckCountArray = [zero, one, two, three, four, five ]
        let colors = ["gray", "purple", "orange", "yellow", "green", "blue"];
        let indexArray = [0, 1, 2, 3, 4, 5]
        
        return indexArray.map((i, index) => {
            let classname = "deckbutton " + colors[i];
            return <button 
                key={index}
                className={classname} 
                onClick={() => this.props.selectDeckButton(i)}>
            {deckCountArray[i]}
            </button>
        })
    }

    render(props){
        //starred cards count
        let {starred } = this.props.level;
        return(
            //regular deck cards 
            <div className="deckbuttons--container">
                <div className="deckbuttons--row">
                    {
                        this.deckButtons()
                    }
                    {/* STARRED BUTTON */}
                    <button 
                    className="deckbutton light-yellow-gradient"
                    onClick={() => this.props.selectDeckButton("starred")}>
                            {starred}
                    </button>
                </div>
            </div>
            
        )
    }
}

export default DeckButtons