import React from 'react';
import './SearchScreen.scss';

class SearchScreen extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            cards: props.cards
        }
    }

    render(){
        return (
            <div className="search-screen">
                Search Screen
            </div>
        );
    }

}

export default SearchScreen;