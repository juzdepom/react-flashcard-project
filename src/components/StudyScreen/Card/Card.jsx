import React, { Component } from 'react';
import './Card.scss';

class Card extends Component {

    constructor(props){
        super(props);

        this.state = {
            show: 0,
            //we need "alreadyFlipped" so that the first time the card appears, the back of the card doesn't fade out
            alreadyFlipped: false,
            editMode: false,
            color: "#xx"
        }

        this.flipCard = this.flipCard.bind(this)
    }

    reset(){
        this.setState({
            alreadyFlipped: false,
            show: 0,
        })
    }

    flipCard(){
        var show = this.state.show;
        //if everything on the card is showing
        if(show >= 2){
            show = 0;
        } else {
            show = show + 1;
        }
        this.setState({
            show,
            alreadyFlipped: true,
        })
    }

    editMode = (isOn) => {
        if(isOn){
            this.props.cardEditModeIsOn(true)
            this.setState({
                editMode: true,
            })
        } else {
            this.props.cardEditModeIsOn(false)
            this.setState({
                editMode: false,
            })
        }
    }

    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        // var sec = a.getSeconds();
        var time = hour + ':' + min + ' ' + month + ' ' + date + ' ' + year;
        return time;
    }

    calculateElapsedTime(timestamp){
        var prevTime = new Date(timestamp * 1000);  // Feb 1, 2011
        var thisTime = new Date();              // now
        var diff = thisTime.getTime() - prevTime.getTime();
        var seconds = Math.floor(diff/1000)
        
        if(seconds < 60) { return seconds + " seconds ago"} else
        //3600 seconds in an hour
        if(seconds < 3600) {
            var m = Math.floor(seconds/60); 
            var s = seconds % 60; 
            return m + " min " + s + " sec ago";
        } //86400 seconds in 24 hours
        else if (seconds < 86400){
            var h = Math.floor(seconds/3600);
            var m = seconds % 3600 //seconds left
            m = Math.floor(m/60)
            return h + " hr " + m + " min ago";
        } else {
            var d = Math.floor(seconds/86400);
            var h = seconds % 86400; // seconds left
            h = Math.floor(h/3600)
            return d + " day " + h + " hr ago";
        }
        
    }

    render(props){
        var colors = ["lightgray", "#AB3B7F", "#F28945", "#FEDD33", "#7EAE2E", "#40A9D6"]
        var {rating, textOne, textTwo, textThree, dateCreated, lastReviewed} = this.props.card;

        //if card is green or blue, have textOne be 
        var color = colors[rating]
        var time = "First Time"
        // var elapsed = ""
        var reviewCount = 0

        var front = textOne
        var back = textThree
        if(parseInt(rating) > 3){
            front = textThree;
            back = textOne;
        } 

        if(lastReviewed == undefined) {
            //add an array to this
            console.log('this one is undefined: ' + textOne)
        }
        
        if(lastReviewed != undefined && lastReviewed.length != 0){
            reviewCount = lastReviewed.length
            lastReviewed = lastReviewed[lastReviewed.length - 1]
            time = this.calculateElapsedTime(lastReviewed)
            // elapsed = this.timeConverter(lastReviewed)
        }
        return(
            <div>
                    <div className="card" 
                        style={{border: `10px solid ${color}`}}
                        onClick={this.flipCard}>
                            <div className="card--top-container">
                                <div className="card--top-container--back-button">
                                    <button onClick={this.props.goToPreviousCard}>Back</button>
                                </div>
                                <div className="card--top-container--date-created">
                                    {dateCreated}
                                </div>
                                <div className="card--top-container--exposure">
                                    👁{reviewCount}
                                </div>
                            </div>
                            {!this.state.editMode ?
                                <div>
                                    <div className="card--front-text-container">
                                        {front}
                                    </div>
                                    {this.state.alreadyFlipped ? 
                                        <div className="card--back-text-container">
                                            <span 
                                                className={this.state.show >= 2 ? "card--back-text-container--pronunciation fade-in" : "card--back-text-container--pronunciation opacity-zero"}>
                                                {textTwo}</span>
                                            <div 
                                                className={this.state.show >= 1 ? "card--back-text-container--thai fade-in" : "card--back-text-container--thai opacity-zero"}>
                                                {back}</div>
                                        </div> 
                                    : ''}
                                </div> 
                            : <div className="card--edit-mode-container">
                                {/* Edit Mode */}
                                <div>
                                    <input
                                        type="text"
                                        value={textOne}
                                        onChange={(event) => this.props.handleCardEdit("textOne", event)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={textTwo}
                                        onChange={(event) => this.props.handleCardEdit("textTwo", event)}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={textThree}
                                        onChange={(event) => this.props.handleCardEdit("textThree", event)}
                                    />
                                </div>
                                <div>
                                    <button onClick={() => this.editMode(false)}>Close</button>
                                </div>
                            </div> }
                            <div className="card--bottom-container">
                                <div className="card--bottom-container--last-review">
                                    <div className="card--bottom-container--text">
                                        <span>Last Reviewed: </span>{time}
                                    </div>
                                </div>
                                <div className="card--bottom-container--edit-button">
                                    <button 
                                        disabled={this.state.editMode}
                                        onClick={() => this.editMode(true)}>
                                            Edit
                                    </button>
                                </div>
                            </div>
                    </div> 
            </div>
        )
    }
}

export default Card