import React, { Component } from 'react';
import './DeckButtons.css';

class DeckButtons extends Component {

    constructor(props){
        super(props);

    }

    render(props){
        let { five, four, three, two, one, zero } = this.props.level;
        return(
            <div className="deckbuttons--container">
                <div className="deckbuttons--row">
                    <button className="deckbutton gray">{zero}</button>
                    <button className="deckbutton purple">{one}</button>
                    <button className="deckbutton orange">{two}</button>
                    <button className="deckbutton yellow">{three}</button>
                    <button className="deckbutton green">{four}</button>
                    <button className="deckbutton blue">{five}</button>
                </div>
            </div>
            
        )
    }
}

export default DeckButtons