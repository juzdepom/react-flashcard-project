import React from 'react';
import './styles.scss'

class Button extends React.Component {

    render(){
        return (
            <button onClick={() => this.props.click()} className="button">{this.props.buttonText}</button>
        )
    }
}

export default Button