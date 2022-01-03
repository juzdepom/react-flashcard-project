import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import StudyScreen from './components/StudyScreen/StudyScreen'
import LoginScreen from './components/StudyScreen/LoginScreen'
import TimeLogScreen from './components/TimeLogScreen/TimeLogScreen';
import MyDecksScreen from './components/StudyScreen/MyDecksScreen';

//firebase
// import { DB_CONFIG } from './config/config';
// import firebase from 'firebase/app';
// import 'firebase/database';

class App extends React.Component {
  constructor(props) {
    super(props)

    // if you don't include the "if statement" an error might occur!
    // if (!firebase.apps.length) {
    //   firebase.initializeApp(DB_CONFIG);
    // }

    this.state = {
      cards: [],
      // sideDrawerOpen: false,
    }
  }

  componentDidMount() {
  }

  drawerToggleClickHandler = () => {
    this.setState((prevState) => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen }
    })
  }

  render() {
    return (
      <Router>
        <div className="App">

          <Route
            path="/"
            exact
            render={(props) => (
              <LoginScreen />
              // <StudyScreen {...props} cards={this.state.cards} />
            )}
          />
          <Route
            path="/app"
            exact
            render={(props) => (
              <StudyScreen {...props} cards={this.state.cards} />
            )}
          />
          <Route
            path="/decks"
            exact
            render={(props) => (
              <MyDecksScreen />
            )}
          />
        
          {/* <Route path="/timelog" render={(props) => <TimeLogScreen />} /> */}
        </div>
      </Router>
    )
  }
}

export default App
