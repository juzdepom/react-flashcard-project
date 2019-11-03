import React from 'react';

class ButtonContainer extends React.Component {
    render(props){
        let editButtonDisabled = (this.props.goalsForTheDayButtonText === "Save") ? true : false
        let goalsButtonDisabled = (this.props.switchEditButtonText === "Save") ? true : false
        return (
            
            <div className="timelog--container-buttons">
                <button 
                    disabled={editButtonDisabled}
                    onClick={() => this.props.switchEditMode()}
                    className="timelog--button-edit">
                    {this.props.switchEditButtonText}
                </button>
                <button 
                    disabled={goalsButtonDisabled}
                    onClick={() => this.props.switchObjectivesMode()}
                    className="timelog--button-edit">
                    {this.props.goalsForTheDayButtonText}
                </button>
            </div>
        );
    }
}

export default ButtonContainer