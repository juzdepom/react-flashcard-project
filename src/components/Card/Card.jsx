import React, { Component } from 'react';
import './Card.css';

class Card extends Component {

    constructor(props){
        super(props);

        this.state = {
            show: false,
            alreadyFlipped: false,
            color: "#xx"
        }

        this.flipCard = this.flipCard.bind(this)
    }

    reset(){
        this.setState({
            alreadyFlipped: false,
            show: false,
        })
    }

    flipCard(){
        this.setState({
            show: !this.state.show,
            alreadyFlipped: true,
        })
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
        // var result = this.timeConverter(seconds)
        // var date = new Date(null)
        // date.setSeconds(seconds);
        // var result = date.toISOString().substr(11,8);
        // console.log("seconds: " + seconds)
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
        var colors = ["#AB3B7F", "#F28945", "#FEDD33", "#7EAE2E", "#40A9D6"]
        var {rating, textOne, textTwo, textThree, exposure, dateCreated, lastReviewed} = this.props.card;
        var color = colors[rating-1]
        var time = "First Time"
        var elapsed = ""

        if(lastReviewed == undefined) {
            console.log('this one is undefined: ' + textOne)
        }
        
        if(lastReviewed != undefined && lastReviewed.length != 0){
            lastReviewed = lastReviewed[lastReviewed.length - 1]
            time = this.calculateElapsedTime(lastReviewed)
            elapsed = this.timeConverter(lastReviewed)
        }
        return(
            <div className="card-container">
                <div className="card" 
                    style={{border: `10px solid ${color}`}}
                    onClick={this.flipCard}>
                        <div className="card-top">
                            <div className="date-created">
                                {dateCreated}
                            </div>
                            <div className="exposure">
                                👁{exposure}
                            </div>
                        </div>
                        <div className="front-text">
                            {textOne}
                        </div>
                        {this.state.alreadyFlipped ? 
                            <div 
                                className={this.state.show ? "back-text fade-in": 'back-text fade-out'}
                                // className="back-text fade-in"
                                >
                                <span className="pronunciation">{textTwo}</span>
                                <div className="thai">{textThree}</div>
                                
                            </div> 
                        : ''}
                        <div className="last-review">
                            <div className="last-review-text">
                                {/* {elapsed} <br/> */}
                                <span>Last Reviewed: </span>{time}
                            </div>
                        </div>
                        
                    {/* </div> */}
                </div>
            </div>
        )
    }
}

export default Card