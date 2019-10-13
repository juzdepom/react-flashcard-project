import React from 'react';
import './Progress.scss';

class Progress extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            progressLogShowing: false,
        }
    }

    displayProgressLog(){
        this.setState({progressLogShowing: true})
        
    }

    closeProgressLog(){
        this.setState({progressLogShowing: false})
    }

    convertDate(dateString){
        //currently dateString reads as dd-mm-yyyy
        //we want it to read as Sep 10, 2019
        return dateString
    }

    calculateTotalExpPoints(array){
        let totalExp = array[0] + (array[1] * 2) + (array[2] * 3) + (array[3] * 4) + (array[4] * 5) + (array[5] * 6)
        return totalExp;
    }
    calculateTotalDeckCount(array){
        let count = array.reduce((a, b) => a + b, 0)
        return count;
    }

    addPlusSignIfPositive(n){
        return (n<0?"":"+") + n
    }

    entryList(){
        let dateString = "date"
        let cardsRated = "cardsRated"
        let deckNumbers = "deckNumbers"

        let progressLogData = this.props.progressLogData
        

        return progressLogData.map((entry, index) => {
            var totalExpEarnedToday = "XX"
            var newCardsAdded = "XX"
            var cardExpEarned = "XX"

            var date = entry[dateString]
            date = this.convertDate(date);
            let deckZero = entry[deckNumbers][0]
            let deckOne = entry[deckNumbers][1]
            let deckTwo = entry[deckNumbers][2]
            let deckThree = entry[deckNumbers][3]
            let deckFour = entry[deckNumbers][4]
            let deckFive = entry[deckNumbers][5]

            let numberOfCards = this.calculateTotalDeckCount(entry[deckNumbers])
            let totalExp = this.calculateTotalExpPoints(entry[deckNumbers])

            if(index == progressLogData.length-1){ //this was the first entry every made
                totalExpEarnedToday = totalExp
                newCardsAdded = numberOfCards
            } else {
                let prev = index + 1
                let prevDeckNumbers = progressLogData[prev][deckNumbers]
                let prevExp = this.calculateTotalExpPoints(prevDeckNumbers)
                totalExpEarnedToday = totalExp - prevExp
                
                let prevNumOfCards = this.calculateTotalDeckCount(prevDeckNumbers)
                newCardsAdded = numberOfCards - prevNumOfCards
            }
            cardExpEarned = totalExpEarnedToday - newCardsAdded

            return  <div className="progress-log--entry">

                <div className="progress-log--entry--deck-numbers">
                    <span className="rating-0">{deckZero}</span>
                    <span className="rating-1">{deckOne}</span>
                    <span className="rating-2">{deckTwo}</span>
                    <span className="rating-3">{deckThree}</span>
                    <span className="rating-4">{deckFour}</span>
                    <span className="rating-5">{deckFive}</span>
                </div>

                <div className="progress-log--entry--info">
                    {date}: <strong>{numberOfCards}</strong> Cards <span>({this.addPlusSignIfPositive(newCardsAdded)} Exp.)</span> / <strong>{totalExp} Exp. </strong>
                    <br/>
                </div>

                <div className="progress-log--entry--exp">{this.addPlusSignIfPositive(totalExpEarnedToday)} Total Exp.</div>
                
                <div className="progress-log--entry--cards-reviewed">
                    <div>Cards Reviewed: {entry[cardsRated]} <span>({this.addPlusSignIfPositive(cardExpEarned)} Exp.)</span></div>
                    {/* <div>New Cards Added: {this.addPlusSignIfPositive(newCardsAdded)}</div> */}
                </div>
               
            </div>
        })
    }

    render(){
        let percentage = Math.floor(this.props.totalPoints / 6000 * 100)
        return (
            <div className="progress">
                Total Cards: {this.props.cards.length} <br/>
                <button
                    className="progress--button" 
                    onClick={() => this.displayProgressLog()}>
                        Total Exp: {this.props.totalPoints}/6000 ({percentage}%)
                </button>

                {this.state.progressLogShowing ? <div className="progress-log--container fade-in">

                    <div className="progress-log--top-row ">
                        <div className="progress-log--top-row--title">Progress Log</div>
                        <button 
                            onClick={() => this.closeProgressLog()}
                            className="progress-log--top-row--close-button">
                            X
                        </button>
                    </div>

                    <div className="progress-log--body">
                        {
                            this.entryList()
                        }
                    </div>
                    
                </div> : '' }

            </div>
        );
    }

}

export default Progress;