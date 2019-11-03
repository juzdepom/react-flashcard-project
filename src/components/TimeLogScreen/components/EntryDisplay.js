import React from 'react';

class EntryDisplay extends React.Component {
    render(props){
        return (
            <div className="timelog--todayslog">
                {this.props.formattedEntry}
            </div>
        );
    }
}

export default EntryDisplay