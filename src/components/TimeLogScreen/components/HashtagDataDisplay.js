import React from 'react';

class HashtagDataDisplay extends React.Component {
    render(props){
        return (
            <div className="timelog--todayslog--hashtag-data-container">
                <button 
                    onClick={() => this.props.switchHashtagDataStyle()}>
                        Switch
                </button>
                {this.props.hashtagData}
            </div>
        );
    }
}

export default HashtagDataDisplay