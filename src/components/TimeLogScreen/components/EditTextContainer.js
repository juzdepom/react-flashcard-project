import React from 'react'

class EditTextContainer extends React.Component {
    render(props){
        return (
            <textarea 
                onChange={(e)=> this.props.update(e)}
                value={this.props.text}
                className="timelog--input-timelog">
                {/* {this.props.text} */}
            </textarea>
        );
    }
}

export default EditTextContainer