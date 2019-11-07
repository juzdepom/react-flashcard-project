import React from 'react';
import './styles.scss';
//fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
const WindowClose = <FontAwesomeIcon icon={faWindowClose} />
// const chevronCircleRight = <FontAwesomeIcon icon={faChevronCircleRight} />

class CloseButton extends React.Component {

    render(){
        return (
            <button onClick={() => this.props.close()} className="closeButton">{WindowClose}</button>
        )
    }
}

export default CloseButton