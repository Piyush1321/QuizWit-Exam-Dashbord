import React from 'react';
import '../css/QuestionNavigate.css';


class QuestionNavigate extends React.Component {
  
    constructor(props) {
        super(props);

    }

    componentDidMount = () => {
    }

    render = () => {
        return (
            <>
                <label className='question-navigate'>
                    <input type="radio" name="questionNavigate" />
                    <span>
                        <div>
                            <img style={{width: "20px"}} src='images/assets/directory.png' />
                        </div>
                        <div>
                            1
                        </div>
                        <div>
                            Who is pm of India...
                        </div>
                    </span>
                </label>
            </>
        )
    }
}

export default QuestionNavigate