import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/includes/Header';
import Navigation from './components/includes/Navigation';

import '../src/App.css';
import '../src/css/Input.css';
import Signin from './components/Signin';
import Flash from './components/services/Flash';
import ExamDetails from './components/ExamDetails';
import Request from './components/services/Request';
import InvalidURL from './components/InvalidURL';
import ExamEndDialog from './components/util/ExamEndDialog';
import DashboardCard from './components/util/DashboardCard';
import Timer from './components/services/Timer';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        examId: 0,
        examTitle: null,
        validURL: false,
        login: false,
        start: false,
        entireExamTimeDuration: null,
        setExamTimer: false,
        setQuestionTimer: false,
        examSubmitted: null,
        studentDetails: {},
        error: '',
        data: {},
        fetchQuestionId: 0,
        questionNavigation: false
    }
  }

  loggedIn = (res) => {
    this.setState({
      login: true,
      validURL: true,
      studentDetails: res.details
    });
  }

  login = () => {
    let url = 'http://localhost:8080/QuizWit/LoginExam';
    Request.post(url, {})
    .then((res) => {
      if(res.success) {
        this.loggedIn(res);
      }
      else {
        this.setState({
          error: res.error
        })
      }
    })
  }



  logout = () => {
    let url = "http://localhost:8080/QuizWit/Logout?user=2";
    Request.get(url)
    .then((res) => {
        if(res.success) {
          this.setState({
            login: false
          }, () => {
            let obj = this.checkIfURLIsValid();
            this.setState({
                examId: obj.examId,
                validURL: obj.valid,
                start: false
            });
          })
          // Flash.message(res.success, 'bg-success');
        }
        else {
            Flash.message(res.error, 'bg-danger');
        }
    })
  }

  nextQuestion = () => {
    this.state.fetchQuestionId = this.state.data.nextQuestionToFetch;
    this.fetchQuestion();
  }

  previousQuestion = () => {
    this.state.fetchQuestionId = this.state.data.previousQuestionToFetch;
    this.fetchQuestion();
  }

  fetchQuestion = () => {
    if(this.state.fetchQuestionId != 0) {
      let url = "http://localhost:8080/QuizWit/ExamNavigation?fetchQuestionNavigationId=";
      url += this.state.fetchQuestionId;
      Request.get(url)
      .then((res) => {
        console.log(res);
          if(res.success) {
            this.setState({
              data: res.data,
              setQuestionTimer: res.data.question.setQuestionTimer
            }, () => {
              this.renderQuestion();
            })
            // Flash.message(res.success, 'bg-success');
          }
          else {
              Flash.message(res.error, 'bg-danger');
          }
      })
    }
  }

  renderQuestion = () => {
    if(this.state.setQuestionTimer) {
      const timer = new Timer();
      if(this.state.data.lastQuestion) {
        console.log('EXAM SUBMIT Timer set');
        timer.set(this.state.data.timeDuration, 'question-timer', this.endExam);
      }
      else if(this.state.data.lastQuestionOfSection) {
        console.log('SECTION SUBMIT Timer set');
        timer.set(this.state.data.timeDuration, 'question-timer', this.submitSection);
      }
      else {
        console.log('NEXT QUESTION Timer set');
        timer.set(this.state.data.timeDuration, 'question-timer', this.nextQuestion);
      }
      timer.start();
    }
  }

  startExam = () => {
    let url = "http://localhost:8080/QuizWit/StartExam";
    Request.get(url)
    .then((res) => {
      console.log('Start Exam --------------------->')
      console.log(res);
        if(res.success) {
          this.setState({
            start: true,
            entireExamTimeDuration: res.entireExamTimeDuration,
            examTitle: res.examTitle,
            setExamTimer: res.setExamTimer,
            data: res.data,
            setQuestionTimer: res.data.question.setQuestionTimer,
            questionNavigation: res.data.questionNavigation
          }, () => {
            this.renderQuestion();
          })
          // Flash.message(res.success, 'bg-success');
        }
        else {
            Flash.message(res.error, 'bg-danger');
        }
    })
  }

  endExamViaDialog = () => {
    let submitExam = document.getElementById('submit-exam-checkbox').checked;
    if(submitExam) {
      this.endExam();
    }
    else {
      Flash.message('Please click on checkbox', 'bg-primary');
    }
  }

  endExam = () => { 
      let url = "http://localhost:8080/QuizWit/EndExam";
      Request.post(url, {})
      .then((res) => {
      console.log(res);
          if(res.success) {
              document.getElementById('route-overlay').style.display = 'none';
              this.logout();
              Flash.message(res.success, 'bg-success');
          }
          else {
              Flash.message(res.error, 'bg-danger');
          }
      });
  }

  submitSection = () => {
    console.log('submit section')
  }

  checkIfURLIsValid = () => {
    let pathname = window.location.pathname;
    pathname = pathname.substr(1, pathname.length);
    if(isNaN(pathname)) {
      return {
        valid: false,
        examId: 0
      }
    }
    else {
      return {
        valid: true,
        examId: pathname
      }
    }
  }

  showEndExamDialog = () => {
    document.getElementById('submit-exam-checkbox').checked = false;
    document.getElementById('route-overlay').style.display = 'block';
    document.getElementById('exam-end-dialog').style.display = 'block';
  }

  componentDidMount = () => {
    this.login();
    let obj = this.checkIfURLIsValid();
    this.setState({
        examId: obj.examId,
        validURL: obj.valid
    });
  }

  render = () => {
    return (
      <div className='fix-wrapper'>
            <Router>
            {
              this.state.validURL && 
              <>
              {
                  this.state.login &&
                  <>
                    {
                      this.state.start && 
                      <>
                        <Header  
                          duration={this.state.entireExamTimeDuration}
                          setExamTimer={this.state.setExamTimer}
                          examTitle={this.state.examTitle}
                          logout={this.logout}
                          endExam={this.endExam}
                          showEndExamDialog={this.showEndExamDialog}
                          endExamViaDialog={this.endExamViaDialog}
                        />
                        <div className='body-wrapper'>
                            <div className='navigation-wrapper'>
                                <Navigation />
                            </div>
                            <div className='content-wrapper'>
                                <div className='content-loaded' style={{height: "100%"}}>
                                    <div className='flex-row mt-10'>
                                        <div className='dashboard-card-container pt-10'>
                                            <DashboardCard title="Active Exams" value="3" icon="fas fa-check" color="linear-gradient(45deg, rgb(102, 144, 105), rgb(88 180 95))" />
                                            <DashboardCard title="Scheduled Exams" value="4" icon="fas fa-calendar" color="linear-gradient(45deg, rgb(195, 83, 126),rgb(226 54 120))"/>
                                            <DashboardCard title="Management Users" value="5" icon="fas fa-users-cog" color="linear-gradient(45deg,rgb(91, 138, 170), rgb(63 155 218))" />
                                            <DashboardCard title="Attempts" value="257" icon="fas fa-users" color="linear-gradient(45deg, rgb(184, 102, 102), rgb(230 76 76))" /> 
                                        </div>
                                    </div>
                                    <div className='flex-col flex-full question-loader-wrapper' style={{overflow: "auto"}}>
                                      <div className='p-10 question-loader' style={{height: "100px"}}>
                                        <div>{this.state.data.question.question}</div>
                                        <div>{this.state.data.question.score}</div>
                                        <div>{this.state.data.question.negative}</div>
                                        <div>{this.state.data.question.timeDuration}</div>
                                        <div id='question-timer'></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                        <div style={{height: "50px", background: "blue", margin: "10px"}}></div>
                                      </div>
                                    </div>
                                    <div className='btn-container flex-row jc-sb'>
                                      {
                                        this.state.questionNavigation &&
                                        <button className='btn btn-dark btn-medium' onClick={this.previousQuestion}>Save &#38; Previous</button>
                                      }
                                      {
                                        !this.state.questionNavigation &&
                                        <div></div>
                                      }
                                      {
                                        this.state.data.lastQuestion &&
                                        <button className='btn btn-danger btn-medium' onClick={this.showEndExamDialog}>End Exam</button>
                                      }
                                      {
                                        !this.state.data.lastQuestion && !this.state.data.lastQuestionOfSection &&
                                        <button className='btn btn-primary btn-medium' onClick={this.nextQuestion}>Save 	&#38; Next</button>
                                      }
                                    </div>
                                </div>
                              <ExamEndDialog 
                                endExam={this.endExamViaDialog}
                              />
                            </div>
                        </div>
                      </>
                    }
                    {
                      !this.state.start &&
                      <ExamDetails 
                        startExam={this.startExam} 
                        logout={this.logout} 
                        studentDetails={this.state.studentDetails}
                        examSubmitted={this.state.examSubmitted}
                      />
                    }
                  </>
                }
                {
                  !this.state.login &&
                  <Signin examId={this.state.examId} loggedIn={this.loggedIn}/>
                }
              </>
              }
          </Router>

        {
          !this.state.validURL &&
          <InvalidURL error={this.state.error}/>
        }
        
      <div id='route-overlay'></div>
      </div>

    )
  }
}

export default App