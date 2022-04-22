import React from 'react';
import '../css/Section.css';
import Timer from '../services/Timer';
import QuestionNavigate from '../util/QuestionNavigate';
import $ from 'jquery';

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
        let togglerShow = document.getElementsByClassName('section-question-toggler-show');
        let togglerHide = document.getElementsByClassName('section-question-toggler-hide');
        for(let i=0; i<sections.length; i++) {
            togglerShow[i].addEventListener('click', () => {
                questions[i].style.display = 'block';
                togglerHide[i].style.display = 'block';
                togglerShow[i].style.display = 'none';
                document.getElementsByClassName('toggle-down')[i].style.display = 'none';
                document.getElementsByClassName('toggle-up')[i].style.display = 'flex';
            })
            togglerHide[i].addEventListener('click', () => {
                questions[i].style.display = 'none';
                togglerHide[i].style.display = 'none';
                togglerShow[i].style.display = 'block';
                document.getElementsByClassName('toggle-down')[i].style.display = 'flex';
                document.getElementsByClassName('toggle-up')[i].style.display = 'none';
            })
        }
    }

    render = () => {
        return (
            <>
                <div  className='section' key={this.props.key}>
                    <div className='info'>
                        <label className='section-label-checked-container section-question-toggler-hide'>
                            <input id={'sectionHide' + this.props.sectionNavigationId} name="sectionNavigationControl1" type="radio" value={this.props.sectionNavigationId} defaultChecked={this.props.sectionNavigationId == this.props.currentSectionId ? true : false}/>
                            <span></span>
                        </label>
                        <label className='section-label-checked-container section-question-toggler-show'>
                            <input id={'sectionShow' + this.props.sectionNavigationId} name="sectionNavigationControl2" type="radio" value={this.props.sectionNavigationId} defaultChecked={this.props.sectionNavigationId == this.props.currentSectionId ? true : false}/>
                            <span></span>
                        </label>
                        <div className='name-timer'>
                            <div className='secondary' style={{fontWeight: "5"}}>
                                {this.props.title}
                            </div>
                            <div>
                                <div style={{fontSize: "13px", marginTop: "5px"}}>
                                    <span className='gray mr-5'>Navigation</span> {this.props.questionNavigation ? <span className='success' style={{fontWeight: "5"}}>On</span> : <span className='danger' style={{fontWeight: "5"}}>Off</span>}
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
                                    currentQuestionNavigationId={this.props.currentQuestionNavigationId}
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