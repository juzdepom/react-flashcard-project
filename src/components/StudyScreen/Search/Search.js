import React from 'react';
import './Search.scss';



class Search extends React.Component {

    constructor(props){
        super(props)

        // let filler = [{"textOne": "test", "rating" : 1}, {"textOne": "test2", "rating": 4}]
        let filler = []

        this.state = {
            foundCards: filler,
            textInput: "", 
            foundText: "",
            display: 'none',
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
        for (var i=0; i<cards.length ; i++){
            if(cards[i].textOne.toLowerCase().includes(e.toLowerCase())){
                //found a card with "textOne" value including search text value
            foundCards.push(cards[i])
            }
        }
        //could not find card
        if (foundCards.length === 0){
            alert(`Could not find card: "${e}"`)
        } else {
            let foundText = `${foundCards.length} matches out of `
            this.setState({
                foundCards,
                foundText,
                display: 'flex',
                buttonText: "Cancel"
            })
        }
    }

    //search/cancel button
    buttonClick(){
        if(this.state.buttonText === "Search"){
            this.searchForCard()
        } else if (this.state.buttonText === "Cancel"){
            this.setState({
                display: 'none',
                buttonText: "Search", 
                textInput: "", 
                foundCards: []
            })
        } else {
            alert("Error! ", this.state.buttonText)
        }
    }

    //returns the card list
    foundCardList(){
        return this.state.foundCards.map(card => {
            let colors = ["lightgray", "#AB3B7F", "#F28945", "#FEDD33", "#7EAE2E", "#40A9D6"]
            let color = colors[card["rating"]]
            let dict = card;
            return <div className="search--card-result" style={{border: `8px solid ${color}`}}>
                    {card["textOne"]}
                    <button 
                        className="search--card-button"
                        onClick={() => this.props.loadCard(dict)}
                    >
                        Select
                    </button>
                </div>
        })
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

                <div className="search--card-body" style={{display: this.state.display}}>
                    {
                        this.foundCardList()
                    }
                </div>

            </div>
        );
    }

}

export default Search;