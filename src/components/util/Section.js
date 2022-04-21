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
                <div className='section' key={this.props.key}>
                    <div className='info'>
                        <div className='name-timer'>
                            <div className='secondary'>
                                {this.props.title}
                            </div>
                            <div>
                                <div style={{fontSize: "15px"}}>
                                    <span className='gray mr-10'>Navigation</span> {this.props.questionNavigation ? <span className='success'>On</span> : <span className='danger'>Off</span>}
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
                                    key={k}
                                    question={d}
                                    navigateToParticularQuestion={this.props.navigateToParticularQuestion}
                                    sectionNavigationId={this.props.sectionNavigationId}
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