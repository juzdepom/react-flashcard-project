import React from 'react';
import './LoginScreen.scss';
import googleAuth from '../../service/auth';
import googleProvider from '../../config/authMethods';

class LoginScreen extends React.Component {

    constructor(props){
        super(props)

        this.state = {
        }

    }

    async handleOnClick(provider){
        const res = await googleAuth(provider)
        //redirect to LoggedIn page
    }

    render(){
        return (
            <div className="login">
                <button
                    type="button"
                    onClick={() => this.handleOnClick(googleProvider)}
                    className="login-btn">
                        Login with Google
                </button>
            </div>
        );
    }

}

export default LoginScreen;