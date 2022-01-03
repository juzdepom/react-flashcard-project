import React from 'react';
import './LoginScreen.scss';
import googleAuth from '../../service/auth';
import googleProvider from '../../config/authMethods';
import { Redirect } from 'react-router';

class LoginScreen extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            redirect: false,
        }
    }

    //FOLLOWED THIS TUTORIAL
    //React authentication with social media (Facebook, Github,Google)
    //https://www.youtube.com/watch?v=MG3ZTfdxODA
    async handleOnClick(provider){
        const res = await googleAuth(provider)
        this.setState({ redirect: true })
        //redirect to LoggedIn page
    }

    //putting this in temporarily so that I don't have to login everytime
    //also there seems to be an error when I try to login via my phone (think I need to change something in the firebase configurations)
    navigateStraightToFlashcards(){
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
                <div className="login">
                    <button
                        type="button"
                        onClick={() => this.handleOnClick(googleProvider)}
                        className="login-btn">
                            Login with Google
                    </button>
                    <button
                        type="button"
                        onClick={() => this.navigateStraightToFlashcards()}
                        className="navigate-btn">
                            Navigate straight to Flashcards
                    </button>
                </div>
            );
        }        
    }

}

export default LoginScreen;