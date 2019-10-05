import React, { Component } from 'react';
import './AddFlashcards.css';

class AddFlashcards extends Component {

    constructor(props){
        super(props);

        this.state = {
            text: "",
            cards: [],
            splitOne: "\n",
            splitTwo: "==",
            splitThree: ">",
            addingCards: false
        }

        this.checkForDuplicatesWithOriginalDeck = this.checkForDuplicatesWithOriginalDeck.bind(this);

        // this.parseText = this.parseText.bind(this);
    }

    updateValue(e){
        this.setState({
            text: e.target.value
        })
    }
    
    parseText(){
        // console.log('testing: ', this.state.originalDeck)
        var flashcardArray = []
        let { text, splitOne, splitTwo, splitThree } = this.state
        
        //if there is no "splitOne" that means that is either only one flashcard,
        //or you are inputting text that cannot be turned into a flashcard
        if(!text.includes(splitOne)){
            if(!text.includes(splitTwo) || !text.includes(splitThree)){
                //string is not valid
                alert(`Error! The string you input is invalid for flashcard creation`);
                return;
            } else {
                //you have input one flashcard
                let dict = this.turnStringIntoFlashcard(text, splitTwo, splitThree)
                flashcardArray.push(dict)
            }
        } else {
            var lines = text.split(splitOne)
        
            //go through each flashcard line
            for (var i in lines){
                var line = lines[i]
                //if doesn't include the separators
                if(!line.includes(splitTwo) || !line.includes(splitThree)){
                    alert(`Error! Line ${i} is invalid for flashcard creation: ${line} `);
                    return;
                }
                let dict = this.turnStringIntoFlashcard(line, splitTwo, splitThree)
                flashcardArray.push(dict)
            }
        }
        this.checkForDuplicatesWithOriginalDeck(flashcardArray)
        console.log(`New Flashcard Array: `, flashcardArray)
        this.setState({
            cards: flashcardArray,
        })

    }

    turnStringIntoFlashcard(text, splitTwo, splitThree){
        var dict = {}
        let frontBack = text.split(splitTwo)
        let textOne = frontBack[0].trim().toLowerCase()
        let back = frontBack[1].split(splitThree)
        let textTwo = back[0].trim()
        let textThree = back[1].trim()
        
        dict["textOne"] = textOne
        dict["textTwo"] = textTwo
        dict["textThree"] = textThree
        dict["rating"] = 0 // TODO create a new rating for new cards.
        dict["lastReviewed"] = []
        dict["dateCreated"] = this.getCurrentDate()

        if(textOne == "" || textTwo == "" || textThree == ""){
            alert("Warning! This line will have an empty text field: ", dict)
        }
        return dict
    }

    //returns yyyy-mm-dd
    getCurrentDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = yyyy + '-' + mm + '-' + dd;
        return today
    }

    checkForDuplicatesWithOriginalDeck(cards){
        let originalDeck = this.props.originalDeck
        for (var i in cards){
            let textOne = cards[i]["textOne"]
            for (var i in originalDeck){
                if(textOne === originalDeck[i]["textOne"]){
                    alert(`Error! You already have this flashcard in your deck, line ${i}: ${textOne} `)
                }
            }
        }
    }

    cancel(){
        this.setState({ text: "", cards: [], addingCards: false})
    }

    //this makes the textfield visible
    addNewCards(){
        this.setState({ addingCards: true})
    }

    //this adds to the master deck
    addFlashCards(){
        this.props.addNewFlashcardsToDeck(this.state.cards);
        this.setState({ text: ""})
    }



    render(props){
       
        return(
            <div>
                { !this.state.addingCards ? <button 
                    className="button"
                    onClick={this.addNewCards.bind(this)}>
                        Add New Cards
                </button> : '' } 
                { this.state.addingCards ? <div>
                    <div>
                        <textarea
                            className="input"
                            placeholder="Add new cards..."
                            type="text"
                            value={this.state.text}
                            onChange={this.updateValue.bind(this)}
                        />
                    </div>
                    <button 
                        className="button"
                        onClick={this.cancel.bind(this)}>
                            Cancel
                    </button>
                    <button 
                        className="button"
                        onClick={this.parseText.bind(this)}>
                            Check For Errors
                    </button>

                    {/* only shows up after we submit text strings for review */}
                    { (this.state.cards.length > 0) ?
                        <div className="results">
                            <div>
                            Number of Cards Created: {this.state.cards.length}
                            </div>

                            <button 
                                className="button"
                                onClick={this.addFlashCards.bind(this)}>
                                    Upload To Firebase
                            </button>
                        </div>
                    : '' }
                </div> : '' }
            </div>
        )
    }
}

export default AddFlashcards