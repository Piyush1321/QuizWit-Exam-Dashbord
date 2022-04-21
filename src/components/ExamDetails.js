import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Request from './services/Request';
import Flash from './services/Flash';

import './css/ExamDetails.css';
import TimeToString from './services/TimeToString';
import DateTime from './services/DateTime';
import Timer from './services/Timer';

class ExamDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exam: {},
            sections: []
        }
    }

    fetchExamDetails = () => {
        let url = "http://localhost:8080/QuizWit/FetchExamDetails";
        Request.get(url)
        .then((res) => {
            if(res.success) {
                let details = res.exam;
                details.timeDuration = (new TimeToString(details.timeDuration)).convert();
                details.windowTime = (new TimeToString(details.windowTime)).convert();
                details.startTime = (new DateTime(parseInt(details.startTime))).convertToView();
                details.endTime = (new DateTime(parseInt(details.endTime))).convertToView();
                let sectionDetails = res.exam.sections;
                for(let i=0; i<sectionDetails.length; i++) {
                    let time = sectionDetails[i].timeDuration;
                    if(time != '-')
                        sectionDetails[i].timeDuration = (new TimeToString(time)).convert();
                }
                this.setState({
                    exam: res.exam,
                    sections: sectionDetails
                }, () => {

                    const timer = new Timer();
                    timer.set(this.state.exam.timeToStart, 'time-to-start', this.startExam);
                    timer.labelView();
                    timer.setMessage('<i class="fas fa-exclamation-circle mr-5"></i>Exam started')
                    timer.start();
                })
            }
            else {
                Flash.message(res.error, 'bg-danger');
            }
        })
    }

    startExam = () => {
        document.getElementById('start-exam-btn').style.display = 'block';
        document.getElementById('starts-in').style.display = 'none';
    }

    componentDidMount = () => {
        document.getElementById('start-exam-btn').style.display = 'none';
        this.fetchExamDetails();
    }

    render = () => {
        return (
            <>
                <div className='exam-details fix-wrapper'>
                    <div className='main-header'>
                        <div className='flex-row jc-sb ai-c'>
                            <div className='webapp flex-row ai-c'>
                                <a href='http://localhost:3002'>
                                    <img src='images/logo/logo.png' className='logo' />
                                </a>
                            </div>
                            <div className='flex-row ai-c'>
                                <div className='flex-row ai-c'>
                                    <div id='candidate-name' className='mr-10'>{this.props.studentDetails.fullName}</div>
                                    <button id='start-exam-btn' className='btn btn-success btn-small ml-10' onClick={this.props.startExam}><i className='fas fa-play mr-5'></i> Start</button>
                                    <button className='btn btn-primary btn-small ml-10' onClick={this.props.logout}><i className='fas fa-sign-out-alt mr-5'></i>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='exam-details-wrapper'>
                        <div className='flex-row'>
                            <div className='block-wrapper flex-full'>
                                <div className='block'>
                                    <div>Exam</div>
                                    <div>{this.state.exam.title}</div>
                                </div>
                                <div className='block'>
                                    <div>Description</div>
                                    <div>{this.state.exam.description}</div>
                                </div>
                            </div>
                            <div className='block-wrapper'>
                                <div className='block'>
                                    <div>Difficulty Level</div>
                                    <div>{this.state.exam.difficultyLevel}</div>
                                </div>
                                <div className='block'>
                                    <div>Time Duration</div>
                                    <div>
                                        <span className='view-block bg-light-primary'>{this.state.exam.timeDuration}</span>
                                    </div>
                                </div>
                                <div className='block'>
                                    <div>Section Navigation</div>
                                    <div>{this.state.exam.sectionNavigation == '1' ? <span className='view-block bg-light-success'>On</span> : <span className='view-block bg-light-danger'>Off</span>}</div>
                                </div>
                                <div className='block'>
                                    <div>Number of Attempts</div>
                                    <div>{this.state.exam.numberOfAttempts}</div>
                                </div>
                                <div className='block'>
                                    <div>Start Time</div>
                                    <div>
                                        <span className='view-block bg-light-primary'>{this.state.exam.startTime}</span>
                                    </div>
                                </div>
                                <div className='block'>
                                    <div>End Time</div>
                                    <div>
                                        <span className='view-block bg-light-primary'>{this.state.exam.endTime}</span>
                                    </div>
                                </div>
                                <div className='block'>
                                    <div>Window Time</div>
                                    <div>{this.state.exam.windowTime}</div>
                                </div>
                                <div className='block'>
                                    <div>Status</div>
                                    {
                                        this.state.exam.examSubmitted &&
                                        <span className='danger' style={{fontWeight: "5"}}>You have already attempted the exam</span>
                                    }
                                    {
                                        !this.state.exam.examSubmitted &&
                                        <div className='flex-col'>
                                            <div id='starts-in'>Starts In</div>
                                            <div id='time-to-start' className='success flex-row ai-c' style={{fontWeight: "5"}}></div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='sections-details-container'>
                            <h4 className='mt-10'>Sections</h4>
                            <div>
                                <div className='table'>
                                    <div>
                                        <div>Name</div>
                                        <div className='section-description'>Description</div>
                                        <div>Question Navigation</div>
                                        <div>Time Duration</div>
                                        <div>Timer Type</div>
                                        <div>Number of Questions</div>
                                    </div>
                                    {
                                        this.state.sections.map((d, k) => {
                                            return <div key={k}>
                                                <div>{d.title}</div>
                                                <div className='section-description'>{d.description}</div>
                                                <div>{d.questionNavigation == '1' ? <span className='view-block bg-light-success'>On</span> : <span className='view-block bg-light-danger'>Off</span>}</div>
                                                <div>{d.timeDuration}</div>
                                                <div>
                                                    {d.setQuestionTimer == '1' ? <span className='view-block bg-light-primary'>Question</span> : ''}
                                                    {d.setSectionTimer == '1' ? <span className='view-block bg-light-primary'>Section</span> : ''}
                                                    {d.setQuestionTimer || d.setSectionTimer ? '' : '-'}
                                                </div>
                                                <div>{d.questions}</div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='instructions mt-20'>
                            <div></div>
                            <div>
                                {this.state.exam.instructions}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
}

export default ExamDetails;
