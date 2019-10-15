import React from 'react';
import './Progress.scss';
import { convertDate } from '../../../methods/methods'

class Progress extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            progressLogShowing: false,
            moreCardsNeeded: 0,
            masteredCardsGoal: 1000,
            cardReviewExp: 0,
            averageTotalExpPerDay: 0,
            numberOfDaysToMastery: 0, 
            dateOfMastery: "",
        }
    }

    displayProgressLog = () => {
        this.setState({progressLogShowing: true})
        this.props.progressLogIsShowing(true)
        this.calculatePredictions()
    }

    closeProgressLog = () => {
        this.setState({progressLogShowing: false})
        this.props.progressLogIsShowing(false)
    }

    // //convert from 14-10-2019 to Oct 14, 2019
    // convertDate(dateString){
    //     var arr = dateString.split("-")
    //     let day = arr[0].trim()
    //     let year = arr[2].trim()
    //     let monthInt = parseInt(arr[1].trim())
    //     var month = ""
    //     switch(monthInt){
    //         case 1: month = "Jan"
    //         break;
    //         case 2: month = "Feb"
    //         break;
    //         case 3: month = "Mar"
    //         break;
    //         case 4: month = "Apr"
    //         break;
    //         case 5: month = "May"
    //         break;
    //         case 6: month = "June"
    //         break;
    //         case 7: month = "July"
    //         break;
    //         case 8: month = "Aug"
    //         break;
    //         case 9: month = "Sep"
    //         break;
    //         case 10: month = "Oct"
    //         break;
    //         case 11: month = "Nov"
    //         break;
    //         case 12: month = "Dec"
    //         break;
    //         default:
    //             alert(`Error: monthInt out of range: ${monthInt}`)
    //             break;
    //     }
    //     var newString = month + " " + day + ", " + year
    //     return newString
    // }

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

    entryList = () => {
        let dateString = "date"
        let cardsRated = "cardsRated"
        let deckNumbers = "deckNumbers"
        var numberOfCardsRated = 0

        let progressLogData = this.props.progressLogData
        
        return progressLogData.map((entry, index) => {
            var totalExpEarnedToday = "XX"
            var newCardsAdded = "XX"
            var cardExpEarned = "XX"

            var date = entry[dateString]
            date = convertDate(date);
            let deckZero = entry[deckNumbers][0]
            let deckOne = entry[deckNumbers][1]
            let deckTwo = entry[deckNumbers][2]
            let deckThree = entry[deckNumbers][3]
            let deckFour = entry[deckNumbers][4]
            let deckFive = entry[deckNumbers][5]

            let numberOfCards = this.calculateTotalDeckCount(entry[deckNumbers])
            let totalExp = this.calculateTotalExpPoints(entry[deckNumbers])

            if(index == progressLogData.length-1){ //this was the first entry every made
                totalExpEarnedToday = "0"
                newCardsAdded = "XX"
                cardExpEarned = "0"
                numberOfCardsRated = "XX"
            } else {
                let prev = index + 1
                let prevDeckNumbers = progressLogData[prev][deckNumbers]
                let prevExp = this.calculateTotalExpPoints(prevDeckNumbers)
                totalExpEarnedToday = totalExp - prevExp
                
                let prevNumOfCards = this.calculateTotalDeckCount(prevDeckNumbers)
                newCardsAdded = numberOfCards - prevNumOfCards
                cardExpEarned = totalExpEarnedToday - newCardsAdded
                numberOfCardsRated = entry[cardsRated]
            }
            
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
                    {date}: <strong>{numberOfCards}</strong> Cards <span>({this.addPlusSignIfPositive(newCardsAdded)} Cards)</span>
                    <br/>
                    Cards Reviewed: {numberOfCardsRated} <span>({this.addPlusSignIfPositive(cardExpEarned)} Exp.)</span>
                </div>

                <div className="progress-log--entry--exp"><strong>{totalExp} Exp. </strong>&nbsp;<span>{this.addPlusSignIfPositive(totalExpEarnedToday)} Total Exp.</span></div>
                
                {/* <div className="progress-log--entry--cards-reviewed">
                    <div>Cards Reviewed: {entry[cardsRated]} <span>({this.addPlusSignIfPositive(cardExpEarned)} Exp.)</span></div>
                </div> */}
               
            </div>
        })
    }

    handleInputEdit = (text, event) => {
        let e = event.target.value
        if(text==="masteredCardsGoal"){
            this.setState({
                masteredCardsGoal: e
            }, () => this.calculatePredictions())
        } else if (text==="averageTotalExpPerDay"){
            this.setState({
                averageTotalExpPerDay: e
            }, () => this.updateInputData("average"))
        } else if (text==="numberOfDaysToMastery"){
            this.setState({
                numberOfDaysToMastery: e
            }, () => this.updateInputData("days"))
        }
    }

    updateInputData = (t) => {
        let entry = this.props.progressLogData[0]
        let expEarned = this.calculateTotalExpPoints(entry["deckNumbers"])
        let goal = this.state.masteredCardsGoal * 6
        let expNeeded = goal - expEarned
        if(t === "average"){
            console.log('exp needed', expNeeded)
            let expPerDay = this.state.averageTotalExpPerDay
            let numberOfDaysToMastery = Math.ceil(expNeeded / expPerDay)
            // console.log('days to amster', expNeeded)
            this.setState({numberOfDaysToMastery})
            // alert(`${this.state.averageTotalExpPerDay}`)
        } else if (t === "days"){
            let days = this.state.numberOfDaysToMastery

            let averageTotalExpPerDay = Math.ceil(expNeeded / days)
            this.setState({averageTotalExpPerDay})
            // alert(`${this.state.numberOfDaysToMastery}`)
        } else {
            alert(`Error: ${t}`)
        }
    }

    calculatePredictions = () => {
        if(this.props.progressLogData.length === 0) {return} //if there are no entries
        if(parseInt(this.state.masteredCardsGoal) === 0) {return}
        
        var moreCardsNeeded = 0;
        var cardReviewExp = 0;
        var averageTotalExpPerDay = 0;
        var numberOfDaysToMastery = 0;

        let entry = this.props.progressLogData[0]
        let numberOfCards = this.calculateTotalDeckCount(entry["deckNumbers"])
        if(parseInt(this.state.masterCardsGoal) < numberOfCards){
            //currently the calculations mess up if you are underneath your total deck count
            //do something so you can calculate how much exp you need to get to, for example 400 mastered cards
        }
        
        moreCardsNeeded = this.state.masteredCardsGoal - numberOfCards
        if(moreCardsNeeded < 0){moreCardsNeeded = 0}//if we need a +(-100) cards, then just change to +0 cards

        let latestExp = this.calculateTotalExpPoints(entry["deckNumbers"])
        cardReviewExp = (this.state.masteredCardsGoal * 6) - moreCardsNeeded - latestExp
       
        if(moreCardsNeeded + cardReviewExp >= 0){
            var array = this.props.progressLogData.slice(0)//creates a duplicate
            var expArray = []
            for(var i in array){
                let totalExp = this.calculateTotalExpPoints(array[i]["deckNumbers"])
                expArray.push(totalExp);
            }
            let difference = expArray[0] - expArray[expArray.length-1]

            averageTotalExpPerDay = Math.round(difference/expArray.length)
            numberOfDaysToMastery = Math.ceil((moreCardsNeeded + cardReviewExp) / averageTotalExpPerDay)
        } else {
            cardReviewExp = 0
        }

        this.setState({
            moreCardsNeeded,
            cardReviewExp,
            averageTotalExpPerDay,
            numberOfDaysToMastery
        })
    }

    render(){
        let percentage = Math.floor(this.props.totalPoints / 6000 * 100)
        let { moreCardsNeeded, masteredCardsGoal, cardReviewExp, averageTotalExpPerDay, numberOfDaysToMastery, dateOfMastery } = this.state;
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
                    <div className="progress-log--predictions">
                        You need <strong>+{cardReviewExp + moreCardsNeeded} Exp.</strong> (+{cardReviewExp} "Card Review" Exp. and +{moreCardsNeeded} cards) to reach your goal of&nbsp;
                        <input
                            type="text"
                            value={masteredCardsGoal}
                            onChange={(event) => this.handleInputEdit("masteredCardsGoal", event)} />
                        &nbsp;mastered cards.<br/>
                        Based off of your current Total Exp. earning rate <br/>(&nbsp;~
                        <input
                            type="text"
                            value={averageTotalExpPerDay}
                            onChange={(event) => this.handleInputEdit("averageTotalExpPerDay", event)} />
                        &nbsp;Exp./day), we are estimating you will have mastered {masteredCardsGoal} cards in&nbsp;
                        <input
                            type="text"
                            value={numberOfDaysToMastery}
                            onChange={(event) => this.handleInputEdit("numberOfDaysToMastery", event)} />
                        &nbsp;days{dateOfMastery}.
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