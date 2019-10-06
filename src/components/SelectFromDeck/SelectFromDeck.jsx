import React, { Component } from 'react';
import './SelectFromDeck.css';

class SelectFromDeck extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }
    
    ratingClicked(i){
        this.props.selectRandomCardFromSpecificDeck(i)
        // alert(`rating clicked: ${i}`)
    }



    render(props){
        return(
                <div>
                    {/* <div className="background"/> */}
                    <div className="container">
                        <button className="select-deck-button gray" onClick={() => this.ratingClicked(0)}>0</button>
                        <button className="select-deck-button purple" onClick={() => this.ratingClicked(1)}>1</button>
                        <button className="select-deck-button orange" onClick={() => this.ratingClicked(2)}>2</button>
                        <button className="select-deck-button yellow" onClick={() => this.ratingClicked(3)}>3</button>
                        <button className="select-deck-button green" onClick={() => this.ratingClicked(4)}>4</button>
                        <button className="select-deck-button blue" onClick={() => this.ratingClicked(5)}>5</button>
                    </div>
                    {/* <div className="background"/> */}
                </div>
            
            
        )
    }
}

export default SelectFromDeck