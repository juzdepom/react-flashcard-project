import React from 'react';
import './MyDecksScreen.scss';
import { Redirect } from 'react-router';

class MyDecksScreen extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            redirect: false,
        }
    }

    handleOnClick(){
        this.setState({ redirect: true })
    }

    render(){
        
        //if redirect is true return redirect component
        if (this.state.redirect)
            {
                return <Redirect to='/app'/>; //REDIRECTS TO StudyScreen PAGE
            }
        else  {
            return (
                <div className="mydecks">
                    <button
                        type="button"
                        onClick={() => this.handleOnClick()}
                        className="mydecks-btn">
                            Navigate to my flashcard deck
                    </button>
                </div>
            );
        }        
    }

}

export default MyDecksScreen;