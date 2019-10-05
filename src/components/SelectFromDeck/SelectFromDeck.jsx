import React, { Component } from 'react';
import './SelectFromDeck.css';

class SelectFromDeck extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
    }
    
    ratingClicked(i){
        alert(`rating clicked: ${i}`)
    }



    render(props){
        return(
                <div>
                    <button disabled className="background"/>
                    <div className="container">
                        <button className="button gray" onClick={() => this.ratingClicked(0)}/>
                        <button className="button purple" onClick={() => this.ratingClicked(1)}/>
                        <button className="button orange" onClick={() => this.ratingClicked(2)}/>
                        <button className="button yellow" onClick={() => this.ratingClicked(3)}/>
                        <button className="button green" onClick={() => this.ratingClicked(4)}/>
                        <button className="button blue-right-btn" onClick={() => this.ratingClicked(5)}/>
                    </div>
                    <button disabled className="background"/>
                </div>
            
            
        )
    }
}

export default SelectFromDeck