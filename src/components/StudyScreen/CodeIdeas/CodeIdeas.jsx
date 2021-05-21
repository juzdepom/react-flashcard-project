// note to self: should combine notes and codeideas and make into a single component

import React, { Component } from 'react';
import './CodeIdeas.scss';

class CodeIdeas extends Component {

    constructor(props){
        super(props);

        this.state = {
            text: "",
            addingCodeIdeas: false,
        }
    }

    //link up state.text with the textfield
    updateValue(e){
        this.setState({
            text: e.target.value
        })
    }
    
    //hide the textfield from view
    close = () => {
        this.setState({ addingCodeIdeas: false})
    }

    //this makes the textfield visible
    openCodeIdeas(){
        this.setState({ addingCodeIdeas: true})
        this.pullCodeIdeas();
    }

    //call the props saveCodeIdeasToFirebase method in parent
    //although maybe technically don't need this.
    saveCodeIdeas(){
        this.props.saveCodeIdeasToFirebase(this.state.text);
        // this.props.addNewFlashcardsToDeck(this.state.cards);
        this.close();
    }

    pullCodeIdeas = () => {
        this.setState({text: this.props.originalCodeIdeas})
    }

    render(props){
    //    let originalCodeIdeas = this.props.originalCodeIdeas
        return(
            <div className="addflashcards">
                { !this.state.addingCodeIdeas ? <button 
                    className="addflashcards--button"
                    onClick={this.openCodeIdeas.bind(this)}>
                        Ideas
                </button> : '' } 
                { this.state.addingCodeIdeas ? <div>
                    <div>
                        <textarea
                            className="addflashcards--input"
                            placeholder="Ideas..."
                            type="text"
                            value={this.state.text}
                            onChange={this.updateValue.bind(this)}
                        />
                    </div>
                    <div>
                        <button 
                        className="addflashcards--button"
                        onClick={this.close}>
                            Cancel
                        </button>
                        

                        <button 
                            className="addflashcards--button"
                            onClick={this.saveCodeIdeas.bind(this)}>
                            Save Ideas
                        </button>
                    </div>

                </div> : '' }
            </div>
        )
    }
}

export default CodeIdeas