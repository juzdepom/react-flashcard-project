import React, { Component } from 'react';
import './RatingButtons.css';

class RatingButtons extends Component {

    constructor(props){
        super(props);

    }

    render(props){
       
        return(
            <div className="ratingbtns--row"> 
                <button className="ratingbtn purple" onClick={() => this.props.ratingClicked(1)}>1 </button>
                <button className="ratingbtn orange" onClick={() => this.props.ratingClicked(2)}>2 </button>
                <button className="ratingbtn yellow" onClick={() => this.props.ratingClicked(3)}>3</button>
                <button className="ratingbtn green" onClick={() => this.props.ratingClicked(4)}>4 </button>
                <button className="ratingbtn blue" onClick={() => this.props.ratingClicked(5)}>5</button>
          </div>
        )
    }
}

export default RatingButtons