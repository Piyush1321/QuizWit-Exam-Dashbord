import React from 'react';
import '../css/Section.css';
import Timer from '../services/Timer';
import QuestionNavigate from '../util/QuestionNavigate';

class Section extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            questions: this.props.questions
        }
    }

    submitSection = () => {
        console.log('submit-section');
    }

    componentDidMount = () => {

        let sections = document.getElementsByClassName('section');
        let questions = document.getElementsByClassName('questions');
        for(let i=0; i<sections.length; i++) {
            let toggleUp = sections[i].getElementsByClassName('toggle-up')[0];
            let toggleDown = sections[i].getElementsByClassName('toggle-down')[0];
            toggleUp.addEventListener('click', () => {
                questions[i].style.display = 'none';
                toggleUp.style.display = 'none';
                toggleDown.style.display = 'flex';
            });
            toggleDown.addEventListener('click', () => {
                questions[i].style.display = 'block';
                toggleUp.style.display = 'flex';
                toggleDown.style.display = 'none';
            });
        }

        const timer = new Timer();
        timer.set(this.props.duration, 'section-timer' + this.props.sectionId, this.submitSection);
        timer.start();
    }

    render = () => {
        return (
            <>
                <div className='section'>
                    <div className='info'>
                        <div className='name-timer'>
                            <div className='secondary'>
                                {this.props.title}
                            </div>
                            <div>
                                <div className='timer'>
                                    <div id={'section-timer' + this.props.sectionId}></div>
                                </div>
                            </div>
                        </div>
                        <div className='toggle toggle-down'>
                            <i className='fas fa-angle-down'></i>
                        </div>
                        <div className='toggle toggle-up'>
                            <i className='fas fa-angle-up'></i>
                        </div>
                    </div>
                    <div className='questions'>
                        {
                            this.state.questions.map((d, k) => {
                                return <QuestionNavigate 
                                    question={d}
                                />
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default Section