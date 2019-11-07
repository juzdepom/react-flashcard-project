import React from 'react';
import CloseButton from './CloseButton'
import './styles.scss';

class ParsedTextDetails extends React.Component {

    render(){
        let title = (this.props.data.title).toUpperCase()
        return (
            <div className="parsedTextDetails--background">
                <div className="parsedTextDetails--container">
                    <div className="parsedTextDetails--header">
                        <div className="parsedTextDetails--header-title">{title} - 5 categories</div>
                        <CloseButton close={this.props.close}/>
                    </div>
                    
                </div>
                
            </div>
        )
    }
}

export default ParsedTextDetails