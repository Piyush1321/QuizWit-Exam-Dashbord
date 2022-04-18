import React from 'react';
import '../css/Question.css';
import ReactMarkdown from 'react-markdown';

class Question extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question
        }
    }

    render = () => {
        return (
            <>
                <div>
                <ReactMarkdown>{this.state.question.question}</ReactMarkdown>
                </div>
            </>
        );
    }
}

export default Question;