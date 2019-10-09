import React from 'react';
import './SearchScreen.scss';



class SearchScreen extends React.Component {

    constructor(props){
        super(props)

        // let filler = [{"textOne": "test", "rating" : 1}, {"textOne": "test2", "rating": 4}]
        let filler = []

        this.state = {
            foundCards: filler,
            foundText: "",
        }
    }

    searchEnter(e){
        if(e.key === 'Enter') {
            var cards = this.props.cards
            var foundCards = []
            for (var i=0; i<cards.length ; i++){
              if(cards[i].textOne.toLowerCase().includes(e.target.value.toLowerCase())){
                  //found a card with "textOne" value including search text value
                foundCards.push(cards[i])
              }
            }
            //could not find card
            if (foundCards.length === 0){
              alert(`Could not find card including "${e.target.value} in your ${cards.length} cards.`)
            } else {
                let foundText = `${foundCards.length} matches out of `
                this.setState({
                    foundCards,
                    foundText,
                })
            }
          }
    }

    foundCardList(){
        return this.state.foundCards.map(card => {
            let colors = ["lightgray", "#AB3B7F", "#F28945", "#FEDD33", "#7EAE2E", "#40A9D6"]
            let color = colors[card["rating"]]
            return <div className="search--card-result" style={{border: `8px solid ${color}`}}>
                    {card["textOne"]}
                    <button className="search--card-button" >
                        Click Here
                    </button>
                </div>
        })
    }

    render(){
        return (
            <div className="searchscreen">

                <div className="searchscreen--title">
                    {this.state.foundText} {this.props.cards.length} Flashcards 
                </div>

                <input
                    className="searchscreen--input"
                    type="text"
                    placeholder="Search English Terms..."
                    onKeyDown={this.searchEnter.bind(this)}
                />
                <div className="searchscreen--card-body">
                    {
                        this.foundCardList()
                    }
                </div>

            </div>
        );
    }

}

export default SearchScreen;