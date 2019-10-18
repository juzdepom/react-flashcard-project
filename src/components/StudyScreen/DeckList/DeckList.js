import React from 'react';
import './DeckList.scss';
import { calculateElapsedTime } from '../../../methods/methods';
import { sortCardsFromLastReviewed } from '../methods';

class DeckCard extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            key: "textOne",
            bodyClass: "decklist--card-body",
            selected: false
        }
    }

    switchText = () => {
        if(this.state.key === "textOne" && !this.state.selected){
            this.props.quickRatingIsOn(true, this.props.card)
            // this.setState({selected: true, bodyClass: "decklist--card-body decklist--card-body-dark"})
            this.setState({selected: true, key: "textThree"})
        } else if (this.state.key === "textThree"){
            this.setState({key: "textTwo"})
        } else if (this.state.key === "textTwo"){
            // this.props.quickRatingIsOn(false)
            // this.setState({key: "textOne", bodyClass: "decklist--card-body", selected: false})
            this.setState({key: "textOne", selected: false})
        }
    }

    selectCard(e){
        e.stopPropagation();
        this.props.selectCard(this.props.card)
    }

    render(){
        let card = this.props.card
        let index = this.props.index + 1
        var {lastReviewed} = card;
        var reviewCount = 0;
        var whenWasLastReview = "No Review"
        if(lastReviewed != undefined && lastReviewed.length != 0){
            reviewCount = lastReviewed.length
            var latestReview = lastReviewed[lastReviewed.length - 1]
            whenWasLastReview = calculateElapsedTime(latestReview)
        }
        var selectClass = `decklist--card-select decklist--0`

        return (
            <div className={this.state.bodyClass} onClick={() => this.switchText()}>
                <div className="decklist--card-reviewCount">{index}</div>
                <div className="decklist--card-text">{card[this.state.key]}</div>
                <div className="decklist--card-lastReview">{reviewCount} 👀 | {whenWasLastReview}</div>
                <div className={selectClass} onClick={(e)=> this.selectCard(e)}></div>
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
            cardText: ""
        }
    }

    quickRatingIsOn = (isOn, card) => {
        if(isOn){
            let cardText = card["textOne"]
            this.setState({quickRatingIsOn: true, card, cardText})
        } else {
            this.setState({quickRatingIsOn: false})
        }
    }

    ratingClicked = (rating) => {
        var card = this.state.card
        card["rating"] = rating;
        this.props.cardRated(card)
        // this.props.close()
        // alert(`rating clicked! ${rating}`)
    }

    cardList = (cards) => {
        return cards.map((card, index) => {
            return <DeckCard 
                selectCard={this.props.selectCard} 
                card={card} 
                index={index}
                quickRatingIsOn={this.quickRatingIsOn}/>
        })
    }

    render(){
        var cards = this.props.cards
       
        return (
            <div className={this.props.deckListClassname} style={{display: this.props.deckListDisplay}}>
                <button 
                    className="decklist--close-button"
                    onClick={()=> this.props.close()}>
                    Close
                </button>
                <div className="decklist--body">
                    {
                        this.cardList(cards)
                    }
                </div>
                { this.state.quickRatingIsOn ? <div className="decklist--quickrating">
                    <div>
                        <div className="decklist--quickrating-title">Quick Rating</div>
                        <div className="decklist--quickrating-card-text">{this.state.cardText}</div>
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