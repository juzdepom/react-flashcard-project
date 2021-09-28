import React from 'react';
import './LoginScreen.scss';


class LoginScreen extends React.Component {

    constructor(props){
        super(props)

        this.state = {
        }

    }

    render(){
        return (
            <div className="login">
                <button
                    type="button"
                    className="login-btn">
                        Login with Google
                </button>
            </div>
        );
    }

}

export default LoginScreen;