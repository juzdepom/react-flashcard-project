import React from 'react';
import './Search.scss';



class Search extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            foundCards: [],
            textInput: "", 
            foundText: "",
            buttonText: "Search"
        }

        this.searchForCard = this.searchForCard.bind(this);
    }

    //handle enter being pressed
    inputKeyDown(e){
        if(e.key === 'Enter') {
            this.searchForCard()
          }
    }

    //handle text input change
    handleChange(e){
        this.setState({
            textInput: e.target.value
        })
    }

    searchForCard(){
        var e = this.state.textInput
        if(e === ""){
            alert("You haven't input anything in the search field!");
            return;
        }
        let cards = this.props.cards
        var foundCards = []
        //check if we are searching for a tag
        if(e.includes('#')){
            //looking for cards with this hashtag
            cards.forEach((card) => {
                //some of the cards will not have hashtag node and will return undefined. Skip over these
                if(card.hashtag == undefined){
                    return;
                }
                //for the cards with the hashtag node, find the card with the hashtag that matches the search entry
                if(card.hashtag.toLowerCase().includes(e.toLowerCase())){
                    foundCards.push(card)
                }
            })
        } else {
            //loop through the card deck and search according to card deck
            cards.forEach((card) => {
                if(card.textOne.toLowerCase().includes(e.toLowerCase())){
                    //found a card with "textOne" value including search text value
                    foundCards.push(card)
                }
            })
        }
        
        //could not find card
        if (foundCards.length === 0){
            alert(`Could not find card: "${e}"`)
        } 
        else {
            let foundText = `${foundCards.length} matches out of `
            this.setState({
                foundCards,
                foundText,
                buttonText: "Cancel"
            })
            //TODO: also pass in the foundCards, so that you can display in the search decklist.
            this.props.selectDeckButton("search", foundCards)
        }
    }

    //search/cancel button
    buttonClick(){
        if(this.state.buttonText === "Search"){
            this.searchForCard()
        } else if (this.state.buttonText === "Cancel"){
            this.setState({
                buttonText: "Search", 
                textInput: "", 
                foundCards: []
            })
        } else {
            alert("Error! ", this.state.buttonText)
        }
    }

    render(){
        return (
            <div className="search">

                <input
                    className="search--input"
                    value={this.state.textInput}
                    onChange={this.handleChange.bind(this)}
                    type="text"
                    placeholder="Search English Terms..."
                    onKeyDown={this.inputKeyDown.bind(this)}
                />

                <button 
                    className="search--button" 
                    onClick={this.buttonClick.bind(this)}>
                    {this.state.buttonText}
                </button>

            </div>
        );
    }

}

export default Search;