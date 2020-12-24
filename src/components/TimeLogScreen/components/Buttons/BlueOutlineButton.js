import React from 'react';
import './BlueOutlineButton.scss'

class BlueOutlineButton extends React.Component {
    render(props){
        return (
                <button 
                    disabled={this.props.disabled}
                    onClick={() => this.props.click()}
                    className="blueoutlinebtn">
                    {this.props.text}
                </button>
        );
    }
}

export default BlueOutlineButton