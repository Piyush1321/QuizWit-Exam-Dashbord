import React from 'react';
import '../css/Section.css';
import QuestionNavigate from '../util/QuestionNavigate';

class Section extends React.Component {
  
    constructor(props) {
        super(props);

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
    }

    render = () => {
        return (
            <>
                <div className='section'>
                    <div className='info'>
                        <div className='name-timer'>
                            <div>
                                Section Name
                            </div>
                            <div>Timer</div>
                        </div>
                        <div className='toggle toggle-down'>
                            <i className='fas fa-angle-down'></i>
                        </div>
                        <div className='toggle toggle-up'>
                            <i className='fas fa-angle-up'></i>
                        </div>
                    </div>
                    <div className='questions'>
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                        <QuestionNavigate />
                    </div>
                </div>
            </>
        )
    }
}

export default Section