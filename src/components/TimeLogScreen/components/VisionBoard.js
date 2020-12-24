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
                        <div className="visionBoard--display">
                            <strong>Measurable Goals:</strong><br/>
                            I make $5000 a month (after taxes) doing work that I love from my laptop and am saving at least 50% of everything that I make<br/>
                            WHY? I can pay for a plane ticket back home, or a plane ticket to literally anywhere. I am be saving enough to be able to take care of others. I have confidence due to the competence I have acheived. <br/>
                            THIS is the one goal that I am going to focus on above all else. Just like Rachel Hollis said, focusing on one goal will "rise all ships. You will be "dropping a boulder" into a lake, as opposed to dropping a bunch of pebbles into a lake that equal the same weight.<br/>
                            I weigh 63 kg.<br/>

                            <br/>
                            <strong>Not measurable goals:</strong><br/>
                            I am gentle and kind. It makes me happy to help others.<br/>
                            My programming skills are really good because I love coding and practice it everyday. I'm at a senior developer level.
                            I am in in control of my emotions and can return to a calm neutral state at a moment's notice.<br/>
                            I wake up everyday mentally strong and healthy.<br/>
                            I am an artist/creator/programmer.<br/>
                            <br/>
                            <strong>Meditations:</strong><br/>
                            Gentle and kind smiling to mirror. <br/>
                            I am intentional.<br/>
                            I am courageous.<br/>
                        </div>
                    }
                </div>
                
            </div>
        )
    }
}

export default VisionBoard