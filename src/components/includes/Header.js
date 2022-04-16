import React from 'react';
import '../css/Header.css';
import Timer from '../services/Timer';

class Header extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            entireExamTime: this.props.duration
        }
    }

    endExam = () => {
        console.log('Exam Ended');
    }

    componentDidMount = () => {
        const timer = new Timer();
        timer.set(this.state.entireExamTime, 'entire-exam-timer-block', this.endExam);
        timer.start();
    }

    render = () => {
        return (
            <div className='main-header'>
                <div className='flex-row jc-sb ai-c'>
                    <div className='webapp flex-row ai-c'>
                        <a href='http://localhost:3000'>
                            <img src='images/logo/logo.png' className='logo' />
                        </a>
                        <div className='ml-10'>{this.props.examTitle}</div>
                    </div>
                    <div className='flex-row ai-c'>
                        <div className='flex-row ai-c'>
                            <div id='candidate-name' className='mr-10'>Ishwar Baisla</div>
                            <div id='entire-exam-timer-block' className='timer'></div>
                            <button className='btn btn-danger btn-small ml-10'>End Exam</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header