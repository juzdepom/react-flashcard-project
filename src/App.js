import React from 'react';
import './App.css';
import Card from './components/Card/Card';
import data from './data/cards.json';

class App extends React.Component {

  constructor(props){
    super(props)
    this.cardElement = React.createRef();
    this.cardsDataRef = React.createRef();
    this.buttonOne = React.createRef();
    this.buttonTwo = React.createRef();
    this.buttonThree = React.createRef();
    this.buttonFour = React.createRef();
    this.buttonFive = React.createRef();

    this.updateDisplayCardLevels = this.updateDisplayCardLevels.bind(this);
    this.generateRandomIndex = this.generateRandomIndex.bind(this);
    this.handleCardEdit = this.handleCardEdit.bind(this);
    //delete soon editFront and editBack
    this.editFront = this.editFront.bind(this);
    this.editBack = this.editBack.bind(this);
    this.copyJsonCardDataToClipboard = this.copyJsonCardDataToClipboard.bind(this);
    this.goToPreviousCard = this.goToPreviousCard.bind(this);
    this.searchEnter = this.searchEnter.bind(this);
    // this.ratingClicked = this.ratingClicked.bind(this);

    this.state = {
      cards: [],
      currentCard: {},
      currentCardIndex: 0,
      previousCardIndex: 0,
      level: {},
      editFront: false,
      editBack: false,
      flashcardsRated: 0,
      //temporary
      newDeck: []
    }
  }

  componentWillMount(){

    this.setState({
      cards: data,
    })
    
  }

  componentDidMount(){
    var cards = this.state.cards
    this.updateDisplayCardLevels();
    var index = this.generateRandomIndex(cards)
    
    this.setState({
      index,
      currentCard: cards[index]
    })
    document.addEventListener("keydown", this._handleKeyDown);
  }

  _handleKeyDown = (e) => {
    switch(e.keyCode) {
      case 48: //0
        this.cardElement.current.flipCard();
      break;
      case 49: //1
        this.buttonOne.current.click()
        break;
      case 50: //2
        this.ratingClicked(2)
      break;
      case 51: //3
        this.ratingClicked(3)
      break;
      case 52: //4
        this.ratingClicked(4)
      break;
      case 53: //5
        this.ratingClicked(5)
      break;
      case 192: //~
        this.goToPreviousCard()
      break;
      default:
        // alert(e.keyCode)
        break;
    }
  }

  //generate random index to select random flashcard
  generateRandomIndex(currentCards){

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
      one: 0, 
      two: 0,
      three: 0,
      four: 0, 
      five: 0,
      // oneDeck: [],
      // twoDeck: [],
      // threeDeck: [],
      // fourDeck: [],
      // fiveDeck: []
      
    }

    // var newDeck = currentCards
    // for(var i in newDeck){
    //   const timeStamp = newDeck[i].lastReviewed
    //   newDeck[i].lastReviewed = [timeStamp]
    //   var text = newDeck[i].backText
    //   text = text.split(" > ")
    //   var p1 = text[0].trim()
    //   var p2 = text[1].trim()
    //   newDeck[i].textOne = newDeck[i].frontText;
    //   newDeck[i].textTwo = p1;
    //   newDeck[i].textThree = p2;
    //   delete newDeck[i].backText;
    //   delete newDeck[i].frontText;
    // }
    // console.log(newDeck)
    // this.setState({
    //   newDeck
    // })

    for (var i in currentCards){
      switch(currentCards[i].rating){
        case 1: 
          level.one += 1
          level.indexDeck.push(i,i,i,i,i,i,i,i,i,i)
          // level.oneDeck.push(currentCards[i])
        break;
        case 2: level.two += 1
          level.indexDeck.push(i,i,i,i,i,i)
        // level.twoDeck.push(currentCards[i])
        break;
        case 3: level.three += 1
          level.indexDeck.push(i,i,i)
        // level.threeDeck.push(currentCards[i])
        break;
        case 4: level.four += 1
        level.indexDeck.push(i,i)
        // level.fourDeck.push(currentCards[i])
        break;
        case 5: level.five += 1
        level.indexDeck.push(i)
        // level.fiveDeck.push(currentCards[i])
        break;
        default: //
      }
    }
    this.setState({
      level: level
    })
  }

  //you just rated one of the flashcards
  ratingClicked(rating){

    var currentCards = this.state.cards
    var oldIndex = this.state.currentCardIndex
    var timeStamp = Math.floor(Date.now() / 1000);
    currentCards[oldIndex].rating = rating;
    currentCards[oldIndex].exposure += 1;
    // currentCards[oldIndex].lastReviewed = timeStamp;
    currentCards[oldIndex].lastReviewed.push(timeStamp)

    var newIndex = this.generateRandomIndex(currentCards)
    var flashcardsRated = this.state.flashcardsRated + 1
   
    this.setState({
      cards: currentCards,
      previousCardIndex: oldIndex,
      currentCardIndex: newIndex,
      currentCard: currentCards[newIndex],
      flashcardsRated,
    })

    this.updateDisplayCardLevels();
    this.cardElement.current.reset();
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

  //delete soon
  editFront(){
    var inverse = !this.state.editFront
    this.setState({
      editFront: inverse
    })
  }

  //delete soon
  editBack(){
    var inverse = !this.state.editBack
    this.setState({
      editBack: inverse
    })
  }

  goToPreviousCard(){
    var cards = this.state.cards
    var currentCardIndex = this.state.previousCardIndex
    var currentCard = cards[currentCardIndex]
    this.setState({
      currentCardIndex,
      currentCard,
    })
  }

  copyJsonCardDataToClipboard(e){
    this.cardsDataRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    alert("copied to clipboard!")
  }

  searchEnter(e){
    if(e.key === 'Enter') {
      var cards = this.state.cards
      var foundCard = false;
      for (var i=0; i<cards.length ; i++){
        if(cards[i].textOne === e.target.value){
          foundCard = true;
          var previousCardIndex = this.state.currentCardIndex
          var currentCard = cards[i]
          this.setState({
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

  render() {
    // console.log("this.state.cards: ", this.state.cards)
    var { five, four, three, two, one } = this.state.level;

    return (
      <div className="App">
        
        <div className="top-info-row">
            Number of cards in deck: {this.state.cards.length}
            <br/><br/>
            <strong>This Session</strong>
            <br/>
            Number of flashcards rated: {this.state.flashcardsRated}
            <br/>
            Number of terms studied:
            <br/>
            Timer:
            {/* Current card index: {this.state.currentCardIndex} */}
        </div>

        <div className="search-row">
          <input
            className="search-row-input"
             type="text"
             placeholder="Search..."
             onKeyDown={this.searchEnter}
           />
        </div>

        <div className="card-row">
          
          <Card
            ref = {this.cardElement}
            card = {this.state.currentCard}
            goToPreviousCard = {this.goToPreviousCard}
          />

        </div>
        {/* <div className="previous-card-row">
          <button onClick={this.goToPreviousCard}>Previous Card</button>
        </div>
         */}
        <div className="edit-row">
          <div className="edit-row-section">
            <button onClick={this.editFront}>Edit Front</button>
            <br/>
            {
              this.state.editFront ? <input 
              type="text" 
              value={this.state.currentCard.textOne}
              onChange={(event) => this.handleCardEdit("textOne", event)} 
              /> : null
            }
            
          </div>
          <div className="edit-row-section">
            <button onClick={this.editBack}>Edit Pronunc.</button>
            <br/>
            { this.state.editBack ?
               <input 
               type="text" 
               value={this.state.currentCard.textTwo}
               onChange={(event) => this.handleCardEdit("textTwo", event)}
               /> : null
            }
           
          </div>
          <div className="edit-row-section">
            {/* <button onClick={this.editBack}>Edit Pronunc.</button> */}
            <br/>
            {/* { this.state.editBack ? */}
               <input 
               type="text" 
               value={this.state.currentCard.textThree}
               onChange={(event) => this.handleCardEdit("textThree", event)}
               /> 
               {/* : null */}
            {/* } */}
           
          </div>
          
        </div>
        <div className="level-card-row">
          <div className="level-card">{one}</div>
          <div className="level-card">{two}</div>
          <div className="level-card">{three}</div>
          <div className="level-card">{four}</div>
          <div className="level-card">{five}</div>
        </div>

        <div className="button-row">
          <div className="number-button-row"> 
            <button ref={this.buttonOne} className="number-button purple" onClick={() => this.ratingClicked(1)}>
              1 
              {/* <span>D</span> */}
              </button>
            {/* <button className="number-button purple">1</button> */}
            <button ref={this.buttonTwo} className="number-button orange" onClick={() => this.ratingClicked(2)}>
              2 
              {/* <span>F</span> */}
              </button>
            <button ref={this.buttonThree} className="number-button yellow" onClick={() => this.ratingClicked(3)}>
              3 
              {/* <span>J</span> */}
              </button>
            <button ref={this.buttonFour} className="number-button green" onClick={() => this.ratingClicked(4)}>
              4 
              {/* <span>K</span> */}
              </button>
            <button ref={this.buttonFive} className="number-button blue" onClick={() => this.ratingClicked(5)}>
              5 
              {/* <span>L</span> */}
              </button>
          </div>

          <div className="raw-data-row spacer">
              {/* {JSON.stringify(this.state.cards)} */}
              JSON Cards Data
              <br/>
              <button onClick={this.copyJsonCardDataToClipboard}>Copy to Clipboard</button>
              <br/>
              <textarea 
                ref={this.cardsDataRef}
                readOnly
                className="json-cards-data" 
                type="text" 
                value={JSON.stringify(this.state.cards)} 
                // value={JSON.stringify(this.state.newDeck)} 
                />
              <br/><br/>
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                href="https://jsonformatter.curiousconcept.com/">
                  JSON Formatter
              </a>
              <br/><br/>
              <a 
                target="_blank" 
                rel="noopener noreferrer" 
                href="https://translate.google.com/#view=home&op=translate&sl=en&tl=th">
                  Google Translate
              </a>
            </div>
        </div>
      </div>
    );
  };
  
}

export default App;
