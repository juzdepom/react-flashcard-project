import React from 'react';
import './StudyScreen.css';

//components
import Progress from './Progress/Progress';
import Search from './Search/Search';
import DeckList from './DeckList/DeckList';
import Card from './Card/Card';
import AddFlashcards from './AddFlashcards/AddFlashcards';
import SelectFromDeck from './SelectFromDeck/SelectFromDeck';
import DeckButtons from './DeckButtons/DeckButtons';
import RatingButtons from './RatingButtons/RatingButtons';

//firebase
import { DB_CONFIG } from '../../config/config';
import firebase from 'firebase/app';
import 'firebase/database'; 

// hard-coded data
// import data from './data/cards.json';

class StudyScreen extends React.Component {

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
    this.saveFlashcardDataInFirebase = this.saveFlashcardDataInFirebase.bind(this);
    this.addNewFlashcardsToDeck = this.addNewFlashcardsToDeck.bind(this);
    this.selectRandomCardFromSpecificDeck = this.selectRandomCardFromSpecificDeck.bind(this);
    this.ratingClicked = this.ratingClicked.bind(this);
    this.loadCard = this.loadCard.bind(this);
    this.selectRandomCardFromSpecificDeck = this.selectRandomCardFromSpecificDeck.bind(this);
    this.selectDeckButton = this.selectDeckButton.bind(this);
    this.closeDeckList = this.closeDeckList.bind(this);
    
    this.state = {
      cards: this.props.cards,
      currentCard: {},
      previousCard: {},
      currentCardIndex: 0,
      previousCardIndex: 0,
      level: {},
      //this variable resets to zero every time we upload to firebase
      flashcardsRated: 0,
      newDeck: [],
      //
      sideDrawerOpen: false,
      //
      deckListDisplay: "none",
      deckListClassname: "decklist",
      //
      progressLogData: [],
      cardsRated: 0,
      progressLogIsShowing: false
    }

  }

  componentDidMount(){

    //uncomment below to to set data to hardcoded JSON data
    // this.setState({
    //   cards: data["flashcards"],
    // })

    // retrieving the data from firebase
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
    
    database.ref('progressLog').on("value", (snapshot) => {
      let progressLogData = snapshot.val()

      var cardsRated = 0;
      let currentDate = this.getCurrentDate()
      if(currentDate === progressLogData[0]["date"]){
        cardsRated = progressLogData[0]["cardsRated"]
      } else {
        alert("today is a new day!")
      }
      this.setState({
        progressLogData,
        cardsRated,
      })
    })
  }

  //keyboard keys 1-5 help you rate the card; 0 flips the card;
  //SHIFT + 1-5 doesn't rate the card and picks a card from a specific deck.
  _handleKeyDown = (e) => {

    if(this.state.progressLogIsShowing){return}

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

    //number of flashcards that haven't been uploaded to FB yet
    var flashcardsRated = this.state.flashcardsRated + 1
    //total cards rated during a session
   
    this.setState({
      flashcardsRated,
    })
  
    var newIndex = this.generateRandomIndex(this.state.cards)
    this.updateFlashcards(newIndex, rating)

    this.updateDisplayCardLevels();
    
  }

  updateProgressLog(){
    let date = "date"
    let cardsRated = "cardsRated"
    let deckNumbers = "deckNumbers"

    //all entries
    var progressLogData = this.state.progressLogData;
    var entry = {}

    //save the date
    let currentDate = this.getCurrentDate()
    entry[date] = currentDate

    //save the deck numbers
    let { five, four, three, two, one, zero } = this.state.level; 
    entry[deckNumbers] = [zero, one, two, three, four, five]
    
    
    //no entry has been made today yet
    if(progressLogData[0][date] !== currentDate){
      //cards rated begins at zero
      this.setState({
        cardsRated: 0,
      }, () => {
        entry[cardsRated] = this.state.cardsRated;
        progressLogData.unshift(entry) // add to beginning of array
      })
      
    } else { //entry has already been made today
      entry[cardsRated] = this.state.cardsRated
      progressLogData[0] = entry
    }

    this.setState({progressLogData})

    firebase.database().ref('progressLog').set(progressLogData);

  }

  
  getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today
}

  //update the flashcard we just looked at, and set state to newly selected flashcard!
  updateFlashcards(newIndex, rating){
    var cardsRated = this.state.cardsRated + 1
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
      cardsRated,
    }, () => {
      this.updateProgressLog()
    })
    
    this.cardElement.current.reset();

    //if we have rated more 5 cards already, then save to Firebase.
    if(this.state.flashcardsRated > 5) {
      this.saveFlashcardDataInFirebase();
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

    if (specificDeck.length === 0 ) { return } //later one we can make the button inactive

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
      if(currentCards.length < 1){
        alert("Error! currentCards.length < 1!")
        return;
      }
      index = Math.floor(Math.random() * currentCards.length)
    } else {
      if(indexDeck.length < 1) {
        alert("Error! indexDeck.length < 1!")
      }
      var i = Math.floor(Math.random() * indexDeck.length)
      index = indexDeck[i]
    }
    //make sure you don't choose the same card as before
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
          break;
        case 1: 
          level.one += 1
          level.indexDeck.push(i,i,i,i,i,i,i,i,i,i)
          level.totalPoints += 2
          break;
        case 2: level.two += 1
          level.indexDeck.push(i,i,i,i,i,i)
          level.totalPoints += 3
          break;
        case 3: level.three += 1
          level.indexDeck.push(i,i,i)
          level.totalPoints += 4
          break;
        case 4: level.four += 1
          level.indexDeck.push(i,i)
          level.totalPoints += 5
          break;
        case 5: level.five += 1
          level.indexDeck.push(i)
          level.totalPoints += 6
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

  saveFlashcardDataInFirebase(){
    const cards = this.state.cards;
    firebase.database().ref('flashcards').set(cards);
    this.setState({flashcardsRated: 0})
  }

  loadCard(card){
    // alert('loading card!')
    // console.log('card: ', card)
    let previousCard = this.state.currentCard
    var currentCard = card
    this.setState({
      previousCard,
      currentCard,
    })
  }

  addNewFlashcardsToDeck(cards){
    let length = cards.length
    let newDeck = this.state.cards.concat(cards)
    this.setState({cards: newDeck}, () => {
      this.updateDisplayCardLevels();
      this.saveFlashcardDataInFirebase();
    })
    
    alert(`Adding ${length} new cards to deck!`)
        
  }

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  selectDeckButton(deckIndex){
    console.log('deck index:', deckIndex)
    // alert(`tapped deck: ${deckIndex}`)
    let deckListClassname = "decklist decklist--" + deckIndex
    this.setState({
      deckListClassname,
      deckListDisplay: "block"
    })
  }

  closeDeckList(){
    // alert('closing')
    this.setState({deckListDisplay: "none"})
  }

  progressLogIsShowing = (b) => {
    if(b===true){
      this.setState({
        progressLogIsShowing: true
      })
    } else {
      this.setState({
        progressLogIsShowing: false
      })
    }
  }

  render() {
   
    return (
      <div className="StudyScreen">
        {/* TO DO: add a loading screen: Loading Cards from Database... */}
        
        <Progress 
          progressLogIsShowing={this.progressLogIsShowing} 
          cards={this.state.cards} 
          totalPoints={this.state.level.totalPoints} 
          progressLogData={this.state.progressLogData} />

        <Search 
          cards={this.state.cards} 
          loadCard={this.loadCard}
        />

        <DeckButtons 
          level={this.state.level} 
          selectDeckButton={this.selectDeckButton}
        />

        <DeckList 
          deckListDisplay={this.state.deckListDisplay} 
          deckListClassname={this.state.deckListClassname}
          close={this.closeDeckList}
          />

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
          <div className="row" style={{color: 'white'}}>
              <div>Number of flashcards rated: {this.state.flashcardsRated} | {this.state.cardsRated}</div>
              <button className="button" onClick={this.saveFlashcardDataInFirebase}>Save Data in Firebase!</button>
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

export default StudyScreen;

const LinkButton = props => (
  <div style={{margin: "10px"}}>
      <a 
        style={{color: 'white'}}
        target="_blank" 
        rel="noopener noreferrer" 
        href={props.url}>
          {props.title}
      </a>
  </div>
)
