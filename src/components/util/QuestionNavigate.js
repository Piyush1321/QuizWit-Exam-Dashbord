import React from 'react';
import '../css/QuestionNavigate.css';


class QuestionNavigate extends React.Component {
  
    constructor(props) {
        super(props);
        let attempted = this.props.question.attempted ? 'attempted-question' : '';
        let markedAsReview = this.props.question.markedAsReview ? 'marked-as-review-question' : '';
        this.state = {
            attempted: attempted,
            markedAsReview: markedAsReview
        }
    }

    componentDidMount = () => {
    }

    render = () => {
        return (
            <>
                <label className='question-navigate' key={this.props.key}>
                    <input id={'navigation' + this.props.question.navigationId} type="radio" name="questionNavigate" value={this.props.question.navigationId}/>
                    <span  id={'navigationStatus' + this.props.question.navigationId} className={this.state.attempted + ' ' + this.state.markedAsReview}>
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