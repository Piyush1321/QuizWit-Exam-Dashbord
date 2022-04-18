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
                            <div className='flex-row'>
                                <div className='serial-no'>
                                    {this.props.question.serialNo}
                                </div>
                                <div className='question-value'>
                                    {this.props.question.question}
                                </div>
                            </div>
                            <div className='flex-row'>
                                <div className='serial-no'>
                                </div>
                                <div className='flex-full'>score: {this.props.question.score}</div>
                                <div className='flex-full'>Negative: {this.props.question.negative}</div>
                            </div>
                        </div>
                    </span>
                    <div className='question-navigate-clickable' id={this.props.question.navigationId} onClick={this.props.navigateToParticularQuestion}></div>
                </label>
            </>
        )
    }
}

export default QuestionNavigate