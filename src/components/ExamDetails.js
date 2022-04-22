import React from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import Request from './services/Request';
import Flash from './services/Flash';

import './css/ExamDetails.css';
import TimeToString from './services/TimeToString';
import DateTime from './services/DateTime';
import Timer from './services/Timer';
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
class ExamDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exam: {},
            sections: [],
            percentage: 60,
            totalTimeToStart: null,
            timeToStart: null,
            timeToView: null,
            timePercentage: 0,
            control: true,
            examStarted: false,
            interval: null
        }
    }

    reduceTime = () => {
        this.setState({
            timeToStart: this.state.timeToStart - 1,
            timeToView: (new TimeToString(this.state.timeToStart)).format(),
            timePercentage: (this.state.timeToStart/this.state.totalTimeToStart)*100
        }, () => {
            if(this.state.timeToStart <= 0) {
                clearInterval(this.state.interval);
                this.setState({
                    examStarted: true
                })
            }
        });
    }

    fetchExamDetails = () => {
        this.setState({
            control: false
        }, () => {
            let url = "http://localhost:8080/QuizWit/FetchExamDetails";
            Request.get(url)
            .then((res) => {
                console.log(res)
                if(res.success) {
                    let details = res.exam;
                    details.timeDuration = (new TimeToString(details.timeDuration)).convert();
                    details.windowTime = (new TimeToString(details.windowTime)).convert();
                    details.startTime = (new DateTime(parseInt(details.startTime))).convertToView();
                    details.endTime = (new DateTime(parseInt(details.endTime))).convertToView();
                    let sectionDetails = res.exam.sections;
                    for(let i=0; i<sectionDetails.length; i++) {
                        sectionDetails[i]["serialNo"] = i+1;
                        let time = sectionDetails[i].timeDuration;
                        if(time != '-')
                            sectionDetails[i].timeDuration = (new TimeToString(time)).convert();
                    }
                    this.setState({
                        exam: res.exam,
                        sections: sectionDetails,
                        timeToStart: this.state.exam.timeToStart,
                        totalTimeToStart: this.state.exam.timeToStart
                    }, () => {
                        if(!this.state.interval)
                            this.state.interval = setInterval(this.reduceTime, 1000);
                        console.log('Mc');
                        const timer = new Timer();
                        timer.set(this.state.exam.timeToStart, 'time-to-start-timer', this.startExam);
                        timer.labelView();
                        timer.start();
                    });
                }
                else {
                    Flash.message(res.error, 'bg-danger');
                }
            })
        });
    }

    startExam = () => {
        if(!this.state.exam.endExam)
            document.getElementById('start-exam-btn').style.display = 'block';
    }

    componentDidMount = () => {
        document.getElementById('start-exam-btn').style.display = 'none';
        if(this.state.control) {
            this.fetchExamDetails();
        }
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
                                    <div id='time-to-start-timer' className='primary mr-10'></div>
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
                                    <div>Your Attempt</div>
                                    <div>
                                        {
                                            this.state.exam.giveAttempt &&
                                            <span  className='green' style={{fontWeight: "5"}}>{this.state.exam.yourAttempt}</span>
                                        }
                                        {
                                            !this.state.exam.giveAttempt &&
                                            <span  className='danger' style={{fontWeight: "5"}}>{this.state.exam.yourAttempt}</span>
                                        }
                                    </div>
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
                                    <div className='flex-row ai-c'>Status</div>
                                    {
                                        this.state.exam.examSubmitted &&
                                        <span className='danger' style={{fontWeight: "5"}}>You have already attempted the exam</span>
                                    }
                                    {
                                        this.state.examStarted && !this.state.exam.endExam &&
                                        <span className='success' style={{fontWeight: "5"}}>Exam started</span>
                                    }
                                    {
                                        this.state.exam.endExam &&
                                        <span className='danger' style={{fontWeight: "5"}}>Exam ended</span>
                                    }
                                    {

                                        !this.state.exam.examSubmitted && !this.state.exam.endExam && !this.state.examStarted &&
                                            <CircularProgressbarWithChildren 
                                            value={this.state.timePercentage} 
                                            styles={buildStyles({
                                                // Text size
                                                root: {
                                                    width: "100px"
                                                },
                                                textSize: '12px',

                                                pathColor: `rgb(70 162 227)`,
                                                textColor: 'rgb(227 132 74)',
                                                trailColor: '#d6d6d6'
                                              })}
                                            >
                                                <div className='flex-col jc-c ai-c'>
                                                    <div className='success'>Starts In</div>
                                                    <div style={{width: "100px", fontWeight: "5"}}  className='primary flex-row jc-c'>{this.state.timeToView}</div>
                                                </div>
                                            </CircularProgressbarWithChildren>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='sections-details-container'>
                            <h4 className='mt-10'>Sections</h4>
                            <div>
                                <div className='table'>
                                    <div>
                                        <div style={{width: "50px"}}>S No.</div>
                                        <div className='title'>Name</div>
                                        <div className='section-description'>Description</div>
                                        <div className='question-navigation'>Question Navigation</div>
                                        <div className='time-duration'>Time Duration</div>
                                        <div className='timer-type'>Timer Type</div>
                                        <div className='no-of-questions'>Number of Questions</div>
                                    </div>
                                    {
                                        this.state.sections.map((d, k) => {
                                            return <div key={k}>
                                                <div style={{width: "50px"}}>{d.serialNo}</div>
                                                <div className='title'>{d.title}</div>
                                                <div className='section-description'>{d.description}</div>
                                                <div className='question-navigation'>{d.questionNavigation == '1' ? <span className='view-block bg-light-success'>On</span> : <span className='view-block bg-light-danger'>Off</span>}</div>
                                                <div className='time-duration'>{d.timeDuration}</div>
                                                <div className='timer-type'>
                                                    {d.setQuestionTimer == '1' ? <span className='view-block bg-light-primary'>Question</span> : ''}
                                                    {d.setSectionTimer == '1' ? <span className='view-block bg-light-primary'>Section</span> : ''}
                                                    {d.setQuestionTimer || d.setSectionTimer ? '' : '-'}
                                                </div>
                                                <div className='no-of-questions'>{d.questions}</div>
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
