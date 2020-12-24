import React, { Component } from 'react';
import './Notes.scss';

class Notes extends Component {

    constructor(props){
        super(props);

        this.state = {
            text: "",
            addingNotes: false,
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
        this.setState({ addingNotes: false})
    }

    //this makes the textfield visible
    openNotes(){
        this.setState({ addingNotes: true})
        this.pullNotes();
    }

    //call the props saveNotesToFirebase method in parent
    //although maybe technically don't need this.
    saveNotes(){
        this.props.saveNotesToFirebase(this.state.text);
        // this.props.addNewFlashcardsToDeck(this.state.cards);
        this.close();
    }

    pullNotes = () => {
        this.setState({text: this.props.originalNotes})
    }

    render(props){
    //    let originalNotes = this.props.originalNotes
        return(
            <div className="addflashcards">
                { !this.state.addingNotes ? <button 
                    className="addflashcards--button"
                    onClick={this.openNotes.bind(this)}>
                        Notes
                </button> : '' } 
                { this.state.addingNotes ? <div>
                    <div>
                        <textarea
                            className="addflashcards--input"
                            placeholder="Notes..."
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
                            onClick={this.saveNotes.bind(this)}>
                            Save Notes
                        </button>
                    </div>

                </div> : '' }
            </div>
        )
    }
}

export default Notes