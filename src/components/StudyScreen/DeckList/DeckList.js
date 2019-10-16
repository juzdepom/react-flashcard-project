import React from 'react';
import './DeckList.scss';

class DeckCard extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            key: "textOne"
        }
    }

    switchText(){
        if(this.state.key === "textOne"){
            this.setState({key: "textThree"})
        } else if (this.state.key === "textThree"){
            this.setState({key: "textTwo"})
        } else if (this.state.key === "textTwo"){
            this.setState({key: "textOne"})
        }
    }

    render(){
        return (
            <div className="decklist--card-body" onClick={() => this.switchText()}>
                <div className="decklist--card-text">{this.props.card[this.state.key]}</div>
            </div>
        )
    }
}

class DeckList extends React.Component {

    constructor(props){
        super(props)
    }

    switchText(card){

        alert(`switching text: ${card["textThree"]}`);
    }

    cardList = () => {
        return this.props.cards.map((card, index) => {
            return <DeckCard card={card}/>
            // <div className="decklist--card-body" onClick={() => this.switchText(card)}>
            //     <div className="decklist--card-text">{card["textOne"]}</div>
            // </div>
                
        })
    }

    render(){
        return (
            <div className={this.props.deckListClassname} style={{display: this.props.deckListDisplay}}>
                <button 
                    className="decklist--close-button"
                    onClick={()=> this.props.close()}>
                    Close
                </button>
                <div className="decklist--body">
                    {
                        this.cardList()
                    }
                    {/* <div className="decklist--card-body" onClick={}>
                        <div className="decklist--card-text">Text Here</div>
                    </div>
                    <div className="decklist--card-body">
                    </div>
                    <div className="decklist--card-body">
                    </div>
                    <div className="decklist--card-body">
                    </div> */}
                </div>
            </div>
        );
    }

}

export default DeckList;