import React from 'react';
import './DeckList.scss';
import { calculateElapsedTime } from '../../../methods/methods';
// import { sortCardsFromLastReviewed } from '../methods';

class Star extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            starred: this.props.card.starred,
        }
    }

    clickStar = () => {
        //set the star state to opposite
        let starred = !this.state.starred
        this.setState({starred})
        let card = this.props.card
        //call props to change star State.

        this.props.changeStarredState(card, starred)
        // this.props.changeStarredState()
    }

    render(){
        return (
            <div
                onClick={() => this.clickStar()}>
                    {this.state.starred ? 
                        <span role="img" aria-label="filled star">⭐️</span>
                        : <span role="img" aria-label="empty star">☆</span>
                    }
            </div>
        )
    }
}

class DeckCard extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            key: "textOne",
            // bodyClass: "decklist--card-body",
        }
    }

    //when component gets updated
    componentDidUpdate(prevProps, prevState){
    }

    //when component first mounts
    componentDidMount = () => {
    }


    clickCard = () => {
        let thai = this.props.card["textThree"]
        console.log(this.props.card)
        //default
        this.props.speakThai(thai)
        var key = "textOne"
        if(this.state.key === "textOne"){
            key = "textThree"
        } else if (this.state.key === "textThree"){
            //have to set selected to true for the level 4 and 5 cards
            key = "textTwo"
        } else if (this.state.key === "textTwo"){
            key = "textOne"
        }

        this.setState({key})
        this.props.quickRatingIsOn(true, this.props.card)

        setTimeout(() => {
            if (this.props.card.rating > 3){
                this.setState({key: "textThree"})
            } else {
                this.setState({key: "textOne"})
            }
        }, 5000);

    }

    selectCard(e){
        e.stopPropagation();
        this.props.selectCard(this.props.card)
    }

    render(){
        let card = this.props.card
        let index = this.props.index + 1
        //get the last reviewed information
        var {lastReviewed} = card;
        var reviewCount = 0;
        var whenWasLastReview = "No Review"
        if(lastReviewed !== undefined && lastReviewed.length !== 0){
            reviewCount = lastReviewed.length
            var latestReview = lastReviewed[lastReviewed.length - 1]
            whenWasLastReview = calculateElapsedTime(latestReview)
        }

        return (
            <div 
                ref={this.setWRapperRef} 
                className="decklist--card-body">
                <div className="decklist--card-leftSection">
                    <div className="decklist--card-reviewCount">{index}</div>
                    <Star 
                        card={this.props.card}
                        changeStarredState={this.props.changeStarredState}/>
                </div>
                <div className="decklist--card-text" onClick={() => this.clickCard()}>{card[this.state.key]}</div>
                <div className="decklist--card-lastReview">{card.rating} | {reviewCount} <span role="img" aria-label="eyes">👀</span> | {whenWasLastReview}</div>
                <div className="decklist--card-select decklist--0" onClick={(e)=> this.selectCard(e)}></div>

            </div>
        )
    }
}

class DeckList extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            quickRatingIsOn: false,
            card: {},
            cardText: "",
            pronunciation: "",
            thai: "",
        }
    }

    quickRatingIsOn = (isOn, card) => {
        if(isOn){
            let cardText = card["textOne"]
            let pronunciation = card["textTwo"]
            let thai = card["textThree"]
            this.setState({quickRatingIsOn: true, card, cardText, pronunciation, thai})
        } else {
            this.setState({quickRatingIsOn: false})
        }
    }

    ratingClicked = (rating) => {
        var card = this.state.card
        card["rating"] = rating;
        this.props.cardRated(card)
    }

    cardList = (cards) => {
        // return cards.reverse().map((card, index) => {
        return cards.map((card, index) => {
            return <DeckCard 
                key={index}
                selectCard={this.props.selectCard} 
                card={card} 
                index={index}
                changeStarredState={this.props.changeStarredState}
                speakThai={this.props.speakThai}
                quickRatingIsOn={this.quickRatingIsOn}/>
        })
    }

    close = () => {
        // this.cardList(this.props.cards)
        this.props.close()
    }

    render(){
        var cards = this.props.cards
       
        return (
            <div className={this.props.deckListClassname} style={{display: this.props.deckListDisplay}}>
                    <button 
                        className="decklist--close-button"
                        onClick={()=> this.close()}>
                        Close
                    </button>
                <div className="decklist--body">
                    {
                        this.cardList(cards)
                    }
                </div>
                { this.state.quickRatingIsOn ? <div className="decklist--quickrating">
                    <div>
                        <div className="decklist--quickrating-title">Listen&nbsp;<button onClick={() => this.props.speakThai(this.state.thai)}>🔈</button></div>
                        
                        <div className="decklist--quickrating-card-text">{this.state.pronunciation}</div>
                    </div>
                    <div className="decklist--quickrating-button-container">
                        <button onClick={() => this.ratingClicked(1)} className="purple">1</button>
                        <button onClick={() => this.ratingClicked(2)} className="orange">2</button>
                        <button onClick={() => this.ratingClicked(3)} className="yellow">3</button>
                        <button onClick={() => this.ratingClicked(4)} className="green">4</button>
                        <button onClick={() => this.ratingClicked(5)} className="blue">5</button>
                    </div>
                </div> 
                
                : '' }
                
            </div>
        );
    }

}

export default DeckList;