import React from 'react';
import CloseButton from './TextParserDisplay/CloseButton'
import EditTextContainer from './EditTextContainer';
import './VisionBoard.scss';

class VisionBoard extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            editModeIsOn: false,
            buttonText: "Edit",
            //value for the text area
            value: 'xxx',
        }
    }

    toggleEditMode = () => {
        if(this.state.editModeIsOn){
            //saving edits
            this.setState({
                editModeIsOn: false,
                buttonText: "Edit"
            })
            //TO DO: call prop to save in firebase
        } else {
            //switch to edit mode
            this.setState({
                editModeIsOn: true,
                buttonText: "Save"
            })
        }
    }

    update = (e) => {
        //method that is executed every time the edit text container textarea is updated
    }


    render(){
        return (
            <div className="visionBoard--background">
                <div className="visionBoard--container">
                    <div className="visionBoard--header">
                        <div className="visionBoard--header-title">{this.props.title}</div>
                        <CloseButton close={this.props.close}/>
                    </div>

                    <button 
                        onClick={() => this.toggleEditMode()}
                        className="timelog--button-edit">
                        {this.state.buttonText}
                    </button>

                    { this.state.editModeIsOn ? 
                        <EditTextContainer /> :
                        <div>
                            Measurable Goals:<br/>
                            I make $5000 a month net profit doing work that I love from my laptop.<br/>
                            I weigh 63 kg.<br/>
                            <br/>
                            Not measurable goals:<br/>
                            I am in ultimately in control of my emotions and can return to a calm neutral state at a moment's notice. If something is distressing me in the moment, I can return to neutral<br/>
                            I wake up everyday mentally strong and healthy.<br/>
                            I am an artist/creator/programmer.<br/>
                            <br/>
                            Meditations:<br/>
                            I am intentional meditations.<br/>
                            I am courageous meditations.<br/>
                        </div>
                    }
                </div>
                
            </div>
        )
    }
}

export default VisionBoard