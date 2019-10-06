import React from 'react';
import './App.css';
import Card from './components/Card/Card';
import AddFlashcards from './components/AddFlashcards/AddFlashcards';
import SelectFromDeck from './components/SelectFromDeck/SelectFromDeck';
import DeckButtons from './components/DeckButtons/DeckButtons';
import RatingButtons from './components/RatingButtons/RatingButtons';

//firebase
import { DB_CONFIG } from './config/config';
import firebase from 'firebase/app';
import 'firebase/database'; 

// hard-coded data
// import data from './data/cards.json';

class App extends React.Component {

  constructor(props){
    super(props)

    //if you don't include the "if statement" an error might occur!
    if (!firebase.apps.length) {
      firebase.initializeApp(DB_CONFIG);
  }

    //reference to our Card component so we can call the flip() method as well as other methods
    this.cardElement = React.createRef();

    this.updateDisplayCardLevels = this.updateDisplayCardLevels.bind(this);
    this.generateRandomIndex = this.generateRandomIndex.bind(this);
    this.handleCardEdit = this.handleCardEdit.bind(this);
    this.goToPreviousCard = this.goToPreviousCard.bind(this);
    this.searchEnter = this.searchEnter.bind(this);
    this.saveDataInFirebase = this.saveDataInFirebase.bind(this);
    this.addNewFlashcardsToDeck = this.addNewFlashcardsToDeck.bind(this);
    this.selectRandomCardFromSpecificDeck = this.selectRandomCardFromSpecificDeck.bind(this);
    this.ratingClicked = this.ratingClicked.bind(this);
    // this.ratingClicked = this.ratingClicked.bind(this);
    
    this.state = {
      cards: [],
      currentCard: {},
      previousCard: {},
      currentCardIndex: 0,
      previousCardIndex: 0,
      level: {},
      flashcardsRated: 0,
      newDeck: []
    }
  }

  componentDidMount(){

    //uncomment below to to set data to hardcoded JSON data
    // this.setState({
    //   cards: data["flashcards"],
    // })

    //retrieving the data from firebase
    const database = firebase.database()
    database.ref('flashcards').on("value", (snapshot) => {
      // console.log(snapshot.val())
      const firebaseData = snapshot.val()

      this.setState({
        cards: firebaseData
      })

      const cards = this.state.cards

      //show how many cards are in each ratings deck
      this.updateDisplayCardLevels();

      //chose a random card to display
      var index = this.generateRandomIndex(cards)
      
      this.setState({
        index,
        currentCard: cards[index]
      })
      //handle when keyboard is pressed to manually rate and flip cards
      document.addEventListener("keydown", this._handleKeyDown);
    })
  }

  //keyboard keys 1-5 help you rate the card; 0 flips the card;
  //SHIFT + 1-5 doesn't rate the card and picks a card from a specific deck.
  _handleKeyDown = (e) => {
    switch(e.keyCode) {
      case 48: //0
        if(e.shiftKey){
          this.selectRandomCardFromSpecificDeck(0)
        } else {
          this.cardElement.current.flipCard();
        }
      break;
      case 49: //1
        if(e.shiftKey) {
          this.selectRandomCardFromSpecificDeck(1)
        } else { this.ratingClicked(1) }
        break;
      case 50: //2
      if(e.shiftKey) {
        this.selectRandomCardFromSpecificDeck(2)
      } else { this.ratingClicked(2) }
      break;
      case 51: //3
      if(e.shiftKey) {
        this.selectRandomCardFromSpecificDeck(3)
      } else { this.ratingClicked(3) }
      break;
      case 52: //4
      if(e.shiftKey) {
        this.selectRandomCardFromSpecificDeck(4)
      } else { this.ratingClicked(4) }
      break;
      case 53: //5
      if(e.shiftKey) {
        this.selectRandomCardFromSpecificDeck(5)
      } else { this.ratingClicked(5)}
      break;
      case 192: //~
        this.goToPreviousCard()
      break;
      default:
        // console.log(e.keyCode)
        break;
    }
  }

  //you just rated one of the flashcards from 1-5
  ratingClicked(rating){

    //number of flashcards we have rated during this study session
    var flashcardsRated = this.state.flashcardsRated + 1
   
    this.setState({
      flashcardsRated,
    })
  
    var newIndex = this.generateRandomIndex(this.state.cards)
    this.updateFlashcards(newIndex, rating)

    this.updateDisplayCardLevels();
  }

  //update the flashcard we just looked at, and set state to newly selected flashcard!
  updateFlashcards(newIndex, rating){
    var currentCards = this.state.cards
    var oldIndex = this.state.currentCardIndex

    //if card has been rated, update the rating
    if(rating !== undefined){
      currentCards[oldIndex].rating = rating;
    }

    //logging the time this flashcard was reviewed
    var timeStamp = Math.floor(Date.now() / 1000);
    
    //some of the flashcards don't have the "lastReviewed" key
    if(currentCards[oldIndex].lastReviewed !== undefined){
      currentCards[oldIndex].lastReviewed.push(timeStamp)
    } else {
      currentCards[oldIndex]["lastReviewed"] = [timeStamp];
    }

    let previousCard = this.state.currentCard

    this.setState({
      cards: currentCards,
      //so that we can navigate to previous card
      previousCard,
      previousCardIndex: oldIndex,
      currentCardIndex: newIndex,
      currentCard: currentCards[newIndex],
    })
    
    this.cardElement.current.reset();

    //if we have rated more 5 cards already, then save to Firebase.
    if(this.state.flashcardsRated > 5) {
      this.saveDataInFirebase();
    }
  }

  //if the user clicks on a specific key or the button
  selectRandomCardFromSpecificDeck(rating){
  
    //make sure rating is between 1 and 5 in case I make a mistake somewhere
    if (rating < 0 || rating > 5){
      alert("A deck with this rating cannot be selected: ", rating)
      return;
    }
    var specificDeck = []
    let cards = this.state.cards
    // const test = this.state.cards.filter(card => card.rating == rating)
    for (var i in cards){
      //create a deck with only cards with that rating
      if(cards[i].rating === rating){
        //we're also adding the index of the master card array so that if we select "previous card:
        specificDeck.push({
          "index": parseInt(i), 
          "card": cards[i]})
      }
    }

    //choose a random card from that deck with the specific rating
    const index = Math.floor(Math.random() * specificDeck.length)
    
    //get the index of the card in the this.state.cards array
    const newIndex = specificDeck[index].index;

    this.updateFlashcards(newIndex)
  }

  //generate random index to select random flashcard
  generateRandomIndex(currentCards){
    //this is a bit more complicated because I wanted to the likelihood
    //of selecting a level 1 card to be a lot higher than 
    var indexDeck = this.state.level.indexDeck
    var index = 0;
    if(indexDeck == null) {
      index = Math.floor(Math.random() * currentCards.length)
    } else {
      var i = Math.floor(Math.random() * indexDeck.length)
      index = indexDeck[i]
    }
    return (index === this.state.currentCardIndex ) ? this.generateRandomIndex(currentCards) : index;
  }

  //display the number of cards in each rating category (1-5)
  updateDisplayCardLevels(){
    const currentCards = this.state.cards;
    var level = {
      indexDeck: [],
      zero: 0,
      one: 0, 
      two: 0,
      three: 0,
      four: 0, 
      five: 0,
      totalPoints: 0,
    }

    for (var i in currentCards){
      switch(currentCards[i].rating){
        case 0: 
          level.zero += 1
          level.indexDeck.push(i,i,i,i,i,i,i,i,i,i)
          level.totalPoints += 1
        case 1: 
          level.one += 1
          level.indexDeck.push(i,i,i,i,i,i,i,i,i,i)
          level.totalPoints += 1
        break;
        case 2: level.two += 1
          level.indexDeck.push(i,i,i,i,i,i)
          level.totalPoints += 2
        break;
        case 3: level.three += 1
          level.indexDeck.push(i,i,i)
          level.totalPoints += 3
        break;
        case 4: level.four += 1
        level.indexDeck.push(i,i)
        level.totalPoints += 4
        break;
        case 5: level.five += 1
        level.indexDeck.push(i)
        level.totalPoints += 5
        break;
        default: //
      }
    }
    this.setState({
      level: level
    })
  }

  //update the state because you are editting card
  handleCardEdit(text, event){
    var currentCard = this.state.currentCard
    var cards = this.state.cards
    if(text === "textOne"){
      currentCard.textOne = event.target.value;
    } else if (text === "textTwo"){
      currentCard.textTwo = event.target.value;
    } else if (text === "textThree"){
      currentCard.textThree = event.target.value;
    } else {
      alert("Error! Check handleCardEdit()")
    }
    
    cards[this.state.currentCardIndex] = currentCard;
    this.setState({
      currentCard,
      cards,
    })
  }

  //navigate to previous card
  goToPreviousCard(e){
    e.stopPropagation();
    let cards = this.state.cards
    let textOne = this.state.previousCard["textOne"]
    var currentCardIndex = this.state.previousCardIndex
    for(var i in cards){
      if(textOne == cards[i]["textOne"]){
        this.setState({
          currentCardIndex: i,
          currentCard: cards[i],
        })
        return;
      }
    }
    
    // var currentCard = cards[currentCardIndex]
    
  }

  saveDataInFirebase(){
    const cards = this.state.cards;
    firebase.database().ref('flashcards').set(cards);
    this.setState({flashcardsRated: 0})
  }

  //run this method when users presses enter on search
  searchEnter(e){
    if(e.key === 'Enter') {
      var cards = this.state.cards
      var foundCard = false;
      for (var i=0; i<cards.length ; i++){
        if(cards[i].textOne === e.target.value){
          foundCard = true;
          let previousCard = this.state.currentCard
          var previousCardIndex = this.state.currentCardIndex
          var currentCard = cards[i]
          this.setState({
            previousCard,
            previousCardIndex,
            currentCardIndex: i,
            currentCard,
          })
        }
      }
      if (!foundCard){
        alert("Could not find card. Would you like to add this to our new card creation list?")
      }
    }
  }

  addNewFlashcardsToDeck(cards){
    let length = cards.length
    let newDeck = this.state.cards.concat(cards)
    this.setState({cards: newDeck}, () => {
      this.updateDisplayCardLevels();
      this.saveDataInFirebase();
    })
    
    alert(`Adding ${length} new cards to deck!`)
        
  }

  render() {
    let { five, four, three, two, one, zero } = this.state.level;

    return (
      <div className="App">
        
        <div className="search-row">
          <input
            className="search-row-input"
             type="text"
             placeholder="Search English terms..."
             onKeyDown={this.searchEnter}
           />
        </div>

        {/* TODO: create a component for this */}
        <div className="top-info-row">
            Total Cards: {this.state.cards.length} <br/>
            Goal: 1000 mastered cards - Progress: <span style={{color: "green"}}>{this.state.level.totalPoints}</span>/5000 
            ({Math.floor(this.state.level.totalPoints / 5000 * 100)}%)
            <br/>
        </div>

        <DeckButtons level={this.state.level} />

        <div className="card-row">
          <Card
            ref = {this.cardElement}
            card = {this.state.currentCard}
            goToPreviousCard = {this.goToPreviousCard}
            handleCardEdit = {this.handleCardEdit}
          />
          <SelectFromDeck selectRandomCardFromSpecificDeck = {this.selectRandomCardFromSpecificDeck} />
        </div>
 
        <div className="button-row">
          <RatingButtons ratingClicked = {this.ratingClicked}/>

          {/* TODO: create a component for this */}
          <div className="row">
              <div>Number of flashcards rated this session: {this.state.flashcardsRated}</div>
              <button onClick={this.saveDataInFirebase}>Save Data in Firebase!</button>
          </div>

          <div className="row">
            <AddFlashcards 
              originalDeck={this.state.cards}
              addNewFlashcardsToDeck={this.addNewFlashcardsToDeck}
              />
          </div>

          <div className="row">
            <LinkButton url="https://translate.google.com/#view=home&op=translate&sl=en&tl=th" title="Google Translate" />
            <LinkButton url="https://console.firebase.google.com/u/0/project/flashcard-project-5ee54/database/flashcard-project-5ee54/data" title="Firebase" />
            <LinkButton url="https://jsonformatter.curiousconcept.com/" title="JSON Formatter" />
            <LinkButton url="https://github.com/juzdepom/react-flashcard-project" title="See On Github" />
          </div>

        </div>
      </div>
    );
  };
  
}

export default App;

const LinkButton = props => (
  <div style={{margin: "10px"}}>
      <a 
        target="_blank" 
        rel="noopener noreferrer" 
        href={props.url}>
          {props.title}
      </a>
  </div>
)
