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
import Loader from './components/util/Loader';
import SubmitSectionDialog from './components/util/SubmitSectionDialog';
import SubmitQuestionDialog from './components/util/SubmitQuestionDialog';
import Question from './components/util/Question';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        examTitleToShowOnLogin: '',
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
        questionNavigation: false,
        sectionNavigation: false,
        currentQuestionNavigationId: 0,
        questionTimer: null,
        questionLoaded: true
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
      this.saveResponse();
  }

  previousQuestion = () => {
      this.state.fetchQuestionId = this.state.data.previousQuestionToFetch;
      this.saveResponse();
  }

  sendTrueFalseResponse = () => {
    let el = document.getElementsByName('trueFalseAnswer');
    let value = el[0].checked ? el[0].value : '';
    if(value == '')
      value = el[1].checked ? el[1].value : '';
    let data = {
      saveResponseQuestionNavigationId: this.state.currentQuestionNavigationId,
      trueFalseAnswer: value
    };
    return data;
  }

  sendMcqResponse = () => {

    let el = document.getElementsByName('mcqOption');
    let options = '';
    for(let i=0; i<el.length; i++) {
      if(el[i].checked) {
        options += el[i].value;
        if(this.state.data.question.categoryId == 2) {
          if(i != el.length - 1)
            options += ',';
        }
      }
    }
    let data = {
      saveResponseQuestionNavigationId: this.state.currentQuestionNavigationId,
      options: options
    };
    console.log(data);
    return data;
  }
  
  clearResponse = () => {
    let url = "http://localhost:8080/QuizWit/SaveResponse";
    let data = {
      saveResponseQuestionNavigationId: this.state.currentQuestionNavigationId,
      clear: true
    }
    Request.post(url, data)
    .then((res) => {
      if(res.success)
        this.fetchQuestion();
    });
  }

  saveResponse = () => {
    let url = "http://localhost:8080/QuizWit/SaveResponse";
    let data = {};
    if(this.state.data.question.categoryId == 1 || this.state.data.question.categoryId == 2) {
      console.log('MCQ')
      data = this.sendMcqResponse();
    }
    else if(this.state.data.question.categoryId == 3) {
      data = this.sendTrueFalseResponse();
    }
    this.setState({
      questionLoaded: false
    }, () => {
      Request.post(url, data)
      .then((res) => {
        if(res.success)
          this.fetchQuestion();
      });
    });
  }

  navigateToParticularQuestion = (e) => {
    let el = e.target;
    let id = el.id;
    try {
      id = parseInt(id);
      if(this.state.fetchQuestionId != id) {
        this.setState({
          fetchQuestionId: id,
          questionLoaded: false
        }, () => {
          this.fetchQuestion();
        });
      }
    } catch(e) {
      Flash.message(e, 'bg-danger');
    }
  }

  fetchQuestion = () => {
    if(this.state.fetchQuestionId != 0) {
      let url = "http://localhost:8080/QuizWit/ExamNavigation?fetchQuestionNavigationId=";
      url += this.state.fetchQuestionId;
      Request.get(url)
      .then((res) => {
        console.log('Fetch Question called');
        console.log(res);
          if(res.success) {
            if(!res.data.error) {
              this.setState({
                data: res.data,
                setQuestionTimer: res.data.question.setQuestionTimer,
                questionNavigation: res.data.questionNavigation,
                sectionNavigation: res.data.sectionNavigation,
                currentQuestionNavigationId: res.data.question.navigationId
              }, () => {
                this.renderQuestion();
              })
            }
            else {
              this.setState({
                questionLoaded: true
              }, () => {
                Flash.message(res.data.error, 'bg-danger');
              });
            }
            // Flash.message(res.success, 'bg-success');
          }
          else {
              Flash.message(res.error, 'bg-danger');
          }
      })
    }
  }

  renderQuestion = () => {
    if(this.state.questionTimer) {
      this.state.questionTimer.stop();
    }
    if(this.state.setQuestionTimer) {
      this.state.questionTimer = new Timer();
      if(this.state.data.lastQuestion) {
        console.log('EXAM SUBMIT Timer set');
        this.state.questionTimer.set(this.state.data.timeDuration, 'question-timer', this.endExam);
      }
      else if(this.state.data.lastQuestionOfSection && !this.state.sectionNavigation) {
        console.log('SECTION SUBMIT Timer set');
        this.state.questionTimer.set(this.state.data.timeDuration, 'question-timer', this.submitSection);
      }
      else {
        console.log('NEXT QUESTION Timer set');
        this.state.questionTimer.set(this.state.data.timeDuration, 'question-timer', this.nextQuestion);
      }
      this.state.questionTimer.start();
    }

    this.setState({
      questionLoaded: true
    }, () => {
      this.hideSubmitSectionDialog();
      this.hideSubmitQuestionDialog();
    })
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
            questionNavigation: res.data.questionNavigation,
            sectionNavigation: res.data.sectionNavigation,
            currentQuestionNavigationId: res.data.question.navigationId
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
    let url = "http://localhost:8080/QuizWit/SubmitSection";

    let data = {
      saveResponseQuestionNavigationId: this.state.currentQuestionNavigationId
    };

    Request.post(url, data)
    .then((res) => {
      console.log('Section Submitted');
      console.log(res);
      if(res.success) {
        this.nextQuestion();
      }
    });
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

  showSubmitSectionDialog = () => {
    document.getElementById('route-overlay').style.display = 'block';
    document.getElementById('submit-section-dialog').style.display = 'block';
  }

  hideSubmitSectionDialog = () => {
    document.getElementById('submit-section-dialog').style.display = 'none';
    document.getElementById('route-overlay').style.display = 'none';
  }

  showSubmitQuestionDialog = () => {
    document.getElementById('route-overlay').style.display = 'block';
    document.getElementById('submit-question-dialog').style.display = 'block';
  }

  hideSubmitQuestionDialog = () => {
    document.getElementById('submit-question-dialog').style.display = 'none';
    document.getElementById('route-overlay').style.display = 'none';
  }

  componentDidMount = () => {
    this.login();
    let obj = this.checkIfURLIsValid();
    this.setState({
        examId: obj.examId,
        validURL: obj.valid
    }, () => {
      let url = "http://localhost:8080/QuizWit/FetchExamTitle?examId=";
      url += this.state.examId;
      Request.get(url)
      .then((res) => {
        if(res.success) {
          this.setState({
            examTitleToShowOnLogin: res.examTitle
          })
        }
        else {
          this.setState({
            validURL: false
          })
        }
      })
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
                                <Navigation 
                                  navigateToParticularQuestion={this.navigateToParticularQuestion}
                                />
                            </div>
                            <div className='content-wrapper m-10'>
                                <div className='content-loaded' style={{height: "100%"}}>
                                    <div className='flex-row'>
                                        <div className='dashboard-card-container'>
                                            <DashboardCard title="Total Questions" value="5" icon="fas fa-users-cog" color="linear-gradient(45deg,rgb(91, 138, 170), rgb(63 155 218))" />
                                            <DashboardCard title="Attempted" value="3" icon="fas fa-check" color="linear-gradient(45deg, rgb(102, 144, 105), rgb(88 180 95))" />
                                            <DashboardCard title="Marked as Review" value="4" icon="fas fa-calendar" color="linear-gradient(45deg, rgb(195, 83, 126),rgb(226 54 120))"/>
                                            <DashboardCard title="Unattempted" value="257" icon="fas fa-users" color="linear-gradient(45deg, rgb(184, 102, 102), rgb(230 76 76))" /> 
                                        </div>
                                    </div>
                                    <div className='question-header'>
                                      {
                                        this.state.questionLoaded &&
                                        <>
                                          <div className='flex-row ai-c'>
                                            <div>
                                              <span className='mr-10'>Question {this.state.data.question.serialNo}</span>
                                              <span className='gray mr-10'>|</span>
                                              <span className='primary' style={{fontSize: "14px"}}>
                                                {
                                                  this.state.data.question.categoryId == '1' &&
                                                  'MCQ Single Correct'
                                                }
                                                {
                                                  this.state.data.question.categoryId == '2' &&
                                                  'MCQ Multiple Correct'
                                                }
                                                {
                                                  this.state.data.question.categoryId == '3' &&
                                                  'True or False'
                                                }
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <span>Score: {this.state.data.question.score}</span>
                                            <span className='gray mr-10 ml-10'>|</span>
                                            <span>Negative: {this.state.data.question.negative}</span>
                                              {
                                                this.state.setQuestionTimer &&
                                                <div id='question-timer' className='timer ml-10'></div>
                                              }
                                            <button className='btn btn-fade btn-small ml-10' onClick={this.clearResponse}>Clear</button>
                                          </div>
                                        </>
                                      }
                                    </div>
                                    <div className='flex-col flex-full question-loader-wrapper' style={{overflow: "auto"}}>
                                      <div className='p-10 question-loader' style={{height: "100px"}}>
                                        {
                                          this.state.questionLoaded &&
                                          <Question 
                                            question={this.state.data.question}
                                          />
                                        }
                                      </div>
                                    </div>
                                    <div className='btn-container flex-row jc-sb'>
                                      {
                                        (this.state.questionNavigation && !this.state.data.firstQuestion) &&
                                        <button className='btn btn-dark btn-medium' onClick={this.previousQuestion}>Save &#38; Previous</button>
                                      }
                                      {
                                        (!this.state.questionNavigation || this.state.data.firstQuestion) &&
                                        <div></div>
                                      }
                                      {
                                        this.state.data.lastQuestion &&
                                        <button className='btn btn-danger btn-medium' onClick={this.showEndExamDialog}>End Exam</button>
                                      }
                                      {
                                        this.state.data.lastQuestionOfSection && !this.state.data.lastQuestion && !this.state.sectionNavigation &&
                                        <button className='btn btn-secondary btn-medium' onClick={this.showSubmitSectionDialog}>Save &#38; Submit Section</button>
                                      }
                                      {
                                        !this.state.data.lastQuestion && !this.state.data.lastQuestionOfSection && !this.state.questionNavigation &&
                                        <button className='btn btn-primary btn-medium' onClick={this.showSubmitQuestionDialog}>Save &#38; Next</button>
                                      }
                                      {
                                        !this.state.data.lastQuestion &&  this.state.questionNavigation && this.state.sectionNavigation &&
                                        <button className='btn btn-primary btn-medium' onClick={this.nextQuestion}>Save &#38; Next</button>
                                      }
                                    </div>
                                </div>
                              <ExamEndDialog 
                                endExam={this.endExamViaDialog}
                              />
                              <SubmitSectionDialog 
                                submitSection={this.submitSection}
                                closeDialog={this.hideSubmitSectionDialog}
                              />
                              <SubmitQuestionDialog 
                                submitQuestion={this.nextQuestion}
                                closeDialog={this.hideSubmitQuestionDialog}
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
                  <Signin 
                    examId={this.state.examId} 
                    loggedIn={this.loggedIn}
                    examTitle={this.state.examTitleToShowOnLogin}
                  />
                }
              </>
              }
          </Router>

        {
          !this.state.validURL &&
          <InvalidURL error={this.state.error}/>
        }
        
        <div id='route-overlay'></div>
        {
          !this.state.questionLoaded && 
          <Loader />
        }
      </div>
    )
  }
}

export default App