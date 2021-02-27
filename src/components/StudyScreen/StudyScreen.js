import React from 'react';
import './StudyScreen.css';

//components
import Progress from './Progress/Progress';
import Search from './Search/Search';
import DeckList from './DeckList/DeckList';
import Card from './Card/Card';
import Notes from './Notes/Notes';
import AddFlashcards from './AddFlashcards/AddFlashcards';
import SelectFromDeck from './SelectFromDeck/SelectFromDeck';
import DeckButtons from './DeckButtons/DeckButtons';
import RatingButtons from './RatingButtons/RatingButtons';

//firebase
import { DB_CONFIG } from '../../config/config';
import firebase from 'firebase/app';
import 'firebase/database'; 

//methods
import { 
  calculateTotalExpPoints, 
  // addPlusSignIfPositive, 
  sortCardsFromLastReviewed 
} from './methods';

// hard-coded data
// import data from './data/cards.json';

//SPEECH SYNTHESIS
//Traversy Tutorial --> https://www.youtube.com/watch?v=ZORXxxP49G8
const synth = window.speechSynthesis;
let voices = [];
const getVoices = () => {
  voices = synth.getVoices();
};
getVoices();
if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

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
    // this.generateRandomIndex = this.generateRandomIndex.bind(this);
    this.handleCardEdit = this.handleCardEdit.bind(this);
    this.goToPreviousCard = this.goToPreviousCard.bind(this);
    this.saveFlashcardDataInFirebase = this.saveFlashcardDataInFirebase.bind(this);
    this.addNewFlashcardsToDeck = this.addNewFlashcardsToDeck.bind(this);
    this.selectCardFromSpecificDeck = this.selectCardFromSpecificDeck.bind(this);
    this.ratingClicked = this.ratingClicked.bind(this);
    this.loadCard = this.loadCard.bind(this);
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
      deckListCards: [],
      //
      progressLogData: [],
      cardsRated: 0,
      // expEarnedToday: 0,
      yesterdayTotalExpPoints: 0,
      progressLogIsShowing: false,
      //
      cardEditModeIsOn: false,
      //
      originalNotes: ""
    }

  }

  componentDidMount(){


    //uncomment below to to set data to hardcoded JSON data
    // this.setState({
    //   cards: data["flashcards"],
    // })

    // retrieving the data from firebase
    const database = firebase.database()

    //retrieve original notes
    database.ref('notes').on("value", (snapshot) => {
      // console.log(snapshot.val())
      // alert('calling notes method')
      const firebaseData = snapshot.val()

      this.setState({
        originalNotes: firebaseData
      })
      // alert(this.state.originalNotes)
    })
    
    //retreive flashcards
    database.ref('flashcards').on("value", (snapshot) => {
      // console.log(snapshot.val())
      const firebaseData = snapshot.val()

      //go through firebase data and check for flashcards have duplicate titles and duplicate ids because this can prove and issue
      this.setState({
        cards: firebaseData
      })

      const cards = this.state.cards

      //show how many cards are in each ratings deck
      this.updateDisplayCardLevels();

      //chose a random card to display
      var index = this.generateRandomIndex()
      
      this.setState({
        index,
        currentCard: cards[index]
      })
      //handle when keyboard is pressed to manually rate and flip cards
      document.addEventListener("keydown", this._handleKeyDown);
    })
    
    database.ref('progressLog').on("value", (snapshot) => {
      let progressLogData = snapshot.val()
      // var expEarnedToday = 0;
      var cardsRated = 0;
      let currentDate = this.getCurrentDate();
      //get yesterday's exp points
      let yesterdayTotalExpPoints = 0;
      if(progressLogData.length > 1){ //need to make sure progress log has more than one entry!
        let array = progressLogData[1]["deckNumbers"]
        yesterdayTotalExpPoints = calculateTotalExpPoints(array)
      }
      if(currentDate === progressLogData[0]["date"]){
        cardsRated = progressLogData[0]["cardsRated"]
        //calculat
      } else {
        alert("today is a new day!")
        
      }
      this.setState({
        yesterdayTotalExpPoints,
        progressLogData,
        cardsRated,
      })
    })
  }

  cardEditModeIsOn = (isOn) => {
      this.setState({cardEditModeIsOn: isOn})
  }

  //keyboard keys 1-5 help you rate the card; 0 flips the card;
  //SHIFT + 1-5 doesn't rate the card and picks a card from a specific deck.
  _handleKeyDown = (e) => {

    if(this.state.progressLogIsShowing){return}
    if(this.state.cardEditModeIsOn){return}

    switch(e.keyCode) {
      case 48: //0
        if(e.shiftKey){
          this.selectCardFromSpecificDeck(0)
        } else {
          this.cardElement.current.flipCard();
        }
      break;
      case 49: //1
        if(e.shiftKey) {
          this.selectCardFromSpecificDeck(1)
        } else { this.ratingClicked(1) }
        break;
      case 50: //2
      if(e.shiftKey) {
        this.selectCardFromSpecificDeck(2)
      } else { this.ratingClicked(2) }
      break;
      case 51: //3
      if(e.shiftKey) {
        this.selectCardFromSpecificDeck(3)
      } else { this.ratingClicked(3) }
      break;
      case 52: //4
      if(e.shiftKey) {
        this.selectCardFromSpecificDeck(4)
      } else { this.ratingClicked(4) }
      break;
      case 53: //5
      if(e.shiftKey) {
        this.selectCardFromSpecificDeck(5)
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
   
    this.setState({
      flashcardsRated,
    })
  
    var newIndex = this.generateRandomIndex()
    this.updateFlashcards(newIndex, rating)

    // this.updateDisplayCardLevels();
    
  }


  getCurrentDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = dd + '-' + mm + '-' + yyyy;
    return today
  }

  //used in updateFlashcards method
  findIndexInMasterDeck = (currentCard) => {
    var correctIndex = undefined
    var currentCards = this.state.cards
    for(var i in currentCards){
      if (currentCards[i]["_id"] === currentCard["_id"]){
        correctIndex = i
      }
    }
    if (correctIndex === undefined) { alert("error!")} 
    else { return correctIndex }
  }

  //update the flashcard we just looked at, and set state to newly selected flashcard!
  updateFlashcards(newIndex, rating, starred){
    var cardsRated = this.state.cardsRated + 1
    var currentCards = this.state.cards
    var currentCard = this.state.currentCard

    let correctIndex = this.findIndexInMasterDeck(currentCard)

    //starred status of a card has been changed
    if(starred !== undefined){
      currentCards[correctIndex].starred = starred;
      this.setState({cards: currentCards})
    } else {
        //if card has been rated, update the rating
      if(rating !== undefined){
        currentCards[correctIndex].rating = rating;
      }
      //logging the time this flashcard was reviewed
      var timeStamp = Math.floor(Date.now() / 1000);
      
      //some of the flashcards don't have the "lastReviewed" key
      if(currentCards[correctIndex].lastReviewed !== undefined){
        currentCards[correctIndex].lastReviewed.push(timeStamp)
      } else {
        currentCards[correctIndex]["lastReviewed"] = [timeStamp];
      }

      let previousCard = this.state.currentCard
      var i = (newIndex === null) ? correctIndex : newIndex
      // if(i == null){
      //   i = correctIndex;
      // }

      this.setState({
        cards: currentCards,
        previousCard,
        currentCard: currentCards[i],
        cardsRated,
      }, () => {
        this.updateDisplayCardLevels()
        this.updateProgressLog()
      })
      
      this.cardElement.current.reset();
    }

    //if we have rated more 5 cards already, then save to Firebase.
    if(this.state.flashcardsRated > 3) {
      this.saveFlashcardDataInFirebase();
    }
  }

  //it's no longer random, it's now the card you haven't looked at for the longest time
  selectCardFromSpecificDeck(rating){
    this.updateDisplayCardLevels()
    //make sure rating is between 1 and 5 in case I make a mistake somewhere
    if (rating < 0 || rating > 5){
      alert("A deck with this rating cannot be selected: ", rating)
      return;
    }

    let chosenDeck = this.state.level.sortedDeck[String(rating)]
    if (chosenDeck.length === 0 ) { return } //later one we can make the button inactive
    console.log("chosen deck: ", chosenDeck)
    var card = chosenDeck[0]
    //we get an error if we press on a specific deck button two times in a row
    //this is a temporary work around
    if(this.state.currentCard === card){
      card = chosenDeck[1]
    }
    let index = this.findIndexInMasterDeck(card)
    this.updateFlashcards(index)
  }

  findCardWithId(id){
    var cards = this.state.cards
    for (var i in cards){
      if (cards[i]._id === id){
        return cards[i]
      }
    }
    alert("Error! Could not find card with id: ", id)
  }

  //generate random index to select random flashcard
  generateRandomIndex = () => {
    var idDeck = this.state.level.idDeck
    var index = 0;
    if(idDeck === null) {alert("id deck is null!")} 
    else {
      if(idDeck.length < 1) {alert("Warning! idDeck.length < 1!")}
      var i = Math.floor(Math.random() * idDeck.length)
      let id = idDeck[i]
      let card = this.findCardWithId(id)
      index = this.findIndexInMasterDeck(card)
    }
    return index
  }

  //display the number of cards in each rating category (1-5)
  updateDisplayCardLevels(){
    const currentCards = this.state.cards;
    var level = {
      idDeck: [],
      zero: 0,
      one: 0, 
      two: 0,
      three: 0,
      four: 0, 
      five: 0,
      sortedDeck: {
        "0" : [],
        "1" : [],
        "2" : [],
        "3" : [],
        "4" : [],
        "5" : []
      },
      totalPoints: 0,
    }

    // var newDeck = []

    for (var index in currentCards){

      level.sortedDeck[String(currentCards[index].rating)].push(currentCards[index])

      // let id = i
      // var card = currentCards[i]
      // card["_id"] = id
      // newDeck.push(card)

      let i = currentCards[index]._id
      
      switch(currentCards[index].rating){
        case 0: 
          level.zero += 1
          level.idDeck.push(i,i,i,i,i,i,i,i,i,i)
          level.totalPoints += 1
          break;
        case 1: 
          level.one += 1
          level.idDeck.push(i,i,i,i,i,i,i,i,i,i)
          level.totalPoints += 2
          break;
        case 2: level.two += 1
          level.idDeck.push(i,i,i,i,i,i)
          level.totalPoints += 3
          break;
        case 3: level.three += 1
          level.idDeck.push(i,i,i)
          level.totalPoints += 4
          break;
        case 4: level.four += 1
          level.idDeck.push(i,i)
          level.totalPoints += 5
          break;
        case 5: level.five += 1
          level.idDeck.push(i)
          level.totalPoints += 6
          break;
        default: //
      }
    }

    //card that was reviewed the longest time ago appears at index 0
    let dict = level.sortedDeck
    for(var key in dict){
      if(dict[key].length > 1){
        level.sortedDeck[key] = sortCardsFromLastReviewed(dict[key])
      }
    }

    // level.sortedDeck["0"].length > 1

    

    this.setState({
      level: level,
      // cards: newDeck,
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
    let id = this.state.previousCard["_id"]
    // var currentCardIndex = this.state.previousCardIndex
    for(var i in cards){
      if(id === cards[i]["_id"]){
        this.setState({
          // currentCardIndex: i,
          currentCard: cards[i],
        })
        return;
      }
    }
    
    // var currentCard = cards[currentCardIndex]
    
  }

  //save in firebase
  saveFlashcardDataInFirebase(){
    
    // const cards = this.checkFlashcardsForDuplicates(this.state.cards)
    const cards = this.state.cards;

    //JUST ADDED "starred" ATTRIBUTE TO EACH CARD
    // cards.forEach(card => {
    //   card.starred = false;
    //   console.log(card)
    // })

    // let newCards = this.checkFlashcardsForDuplicates(cards)
    //for some reason, I can't seem to save newCards because "because first argument contains undefined?"
    // console.log(newCards)
    firebase.database().ref('flashcards').set(cards);
    this.setState({flashcardsRated: 0})
  }

  // checkFlashcardsForDuplicates(cards){
  //   console.log('checking for duplicates...')
  //   let setOfCards = new Set(cards)
  //   let array = Array.from(setOfCards);
  //   return array
  // }

  loadCard(card){
    let previousCard = this.state.currentCard
    var currentCard = card
    this.setState({
      previousCard,
      currentCard,
    })
  }

  addNewFlashcardsToDeck(c){
    // let currentDeck = this.state.cards
    let deckLength = this.state.cards.length
    var cards = c
    let length = cards.length
    //add unique id to each of the cards
    // for(var i in cards){
    //   let id = parseInt(deckLength) + parseInt(i)
    //   cards[i]["_id"] = id
    // }

    let newDeck = this.state.cards.concat(cards)
    this.setState({cards: newDeck}, () => {
      this.updateDisplayCardLevels();
      this.saveFlashcardDataInFirebase();
    })
    
    alert(`Adding ${length} new cards to deck!`)
        
  }

  //SideDrawer method
  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  //ProgressLog Methods
  //we're saving our daily flashcard learning progress so that we can predict when we will achieve mastery
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

  progressLogIsShowing = (b) => {
    if(b===true){
      this.setState({
        progressLogIsShowing: true,
      })
    } else {
      this.setState({
        progressLogIsShowing: false
      })
    }
  }

  //DeckButton Methods
  selectDeckButton(deckIndex){
    let deckListClassname = "decklist decklist--" + deckIndex
    let deckListCards = this.state.level.sortedDeck[String(deckIndex)]
    this.setState({
      deckListClassname,
      deckListDisplay: "block",
      deckListCards
    })
  }

  //DeckList Methods
  closeDeckList(){
    // alert('closing')
    this.setState({deckListDisplay: "none"})
  }

  deckListSelectCard = (card) => {
    this.closeDeckList()
    this.loadCard(card)
  }

  deckListRatedCard = (card) => {
    //number of flashcards that haven't been uploaded to firebase yet
    var flashcardsRated = this.state.flashcardsRated + 1
   
    this.setState({
      flashcardsRated,
      currentCard: card
    }, () => {
      this.updateFlashcards(null, card["rating"])
    })
  }

  //starred a card
  changeStarredState = (card, starred) => {
    this.setState({
      currentCard: card
    }, () => {
      this.updateFlashcards(null, null, starred)
    })
    // alert('changed state: ' + card["textOne"] + " " + starred)
    
  }

  saveNotesToFirebase(notes){
    // alert(notes)
    firebase.database().ref('notes').set(notes);
  }
  
 

  speakThai(e){
    var text = ""
    if(typeof e === 'string' || e instanceof String){
      text = e
    } else {
      //when coming from Card.jsx, returns a dictionary
      text = e.back;
    }
    
   
    if (synth.speaking) {
      console.error('Already speaking...');
      return;
    }

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(text);

    voices.forEach(voice => {
        if (voice.name === "Kanya") {
          // console.log(voice)
          speakText.voice = voice;
        }
      });

    speakText.rate = 0.75;
    speakText.pitch = 1;
    synth.speak(speakText);
    
    
  }

  

  render() {
   
    return (
      <div className="StudyScreen">
        {/* TO DO: add a loading screen: Loading Cards from Database... */}
        
        <Progress 
          progressLogIsShowing={this.progressLogIsShowing} 
          cards={this.state.cards} 
          totalPoints={this.state.level.totalPoints} 
          yesterdayTotalExpPoints={this.state.yesterdayTotalExpPoints}
          cardsRated={this.state.cardsRated}
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
          cards={this.state.deckListCards}
          speakThai={this.speakThai}
          changeStarredState={this.changeStarredState}
          selectCard={this.deckListSelectCard}
          cardRated={this.deckListRatedCard}
          close={this.closeDeckList}
          />

        <div className="card-row">
          <Card
            ref = {this.cardElement}
            card = {this.state.currentCard}
            speakThai = {this.speakThai}
            cardEditModeIsOn = {this.cardEditModeIsOn}
            goToPreviousCard = {this.goToPreviousCard}
            handleCardEdit = {this.handleCardEdit}
          />
          <SelectFromDeck selectRandomCardFromSpecificDeck = {this.selectCardFromSpecificDeck} />
        </div>
 
        <div className="button-row">
          <RatingButtons ratingClicked = {this.ratingClicked}/>

          {/* TODO: create a component for this */}
          <div className="row" style={{color: 'black'}}>
              <div>Number of flashcards rated: {this.state.flashcardsRated} | {this.state.cardsRated}</div>
              <button className="button" onClick={this.saveFlashcardDataInFirebase}>Save Data in Firebase!</button>
          </div>

          <div className="row">
            
            <AddFlashcards 
              originalDeck={this.state.cards}
              addNewFlashcardsToDeck={this.addNewFlashcardsToDeck}
              />

            <Notes
              originalNotes={this.state.originalNotes} 
              saveNotesToFirebase={this.saveNotesToFirebase}
            />

          </div>

          <div className="row">
            <LinkButton url="https://translate.google.com/#view=home&op=translate&sl=en&tl=th" title="Google Translate" />
            <LinkButton url="https://console.firebase.google.com/u/0/project/flashcard-project-5ee54/database/flashcard-project-5ee54/data" title="Firebase" />
            <LinkButton url="https://github.com/juzdepom/react-flashcard-project" title="See On Github" />
            <LinkButton url="https://jsonformatter.curiousconcept.com/" title="JSON Formatter" />
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
        style={{color: 'black'}}
        target="_blank" 
        rel="noopener noreferrer" 
        href={props.url}>
          {props.title}
      </a>
  </div>
)
