import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/includes/Header';
import Navigation from './components/includes/Navigation';

import '../src/App.css';
import '../src/css/Input.css';
import Signin from './components/Signin';
import Flash from './components/services/Flash';
import TimeToString from './components/services/TimeToString';
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
        questionLoaded: true,
        sections: [],
        dashboardCardData: {
          attemptedQuestions: 0,
          totalQuestions: 0,
          markedAsReviewQuestions: 0,
          unattemptedQuestions: 0
        }
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
        if(res.success) {
          if(this.state.data.question.categoryId == 1 || this.state.data.question.categoryId == 2) {
            let options = document.getElementsByName('mcqOption');
            if(this.state.data.question.categoryId == 1 || this.state.data.question.categoryId == 2) {
              let options = document.getElementsByName('mcqOption');
              for(let i=0; i<options.length; i++)
                options[i].checked = false;
            }
          }
          else if(this.state.data.question.categoryId == 3) {
            let trueFalseAnswer = document.getElementsByName('trueFalseAnswer');
            for(let i=0; i<trueFalseAnswer.length; i++)
              trueFalseAnswer[i].checked = false;
          }
          document.getElementById('clear-response-btn-container').style.display = 'none';
          this.fetchQuestion();
        }
      });
  }

  saveResponse = () => {
    let url = "http://localhost:8080/QuizWit/SaveResponse";
    let data = {};
    if(this.state.data.question.categoryId == 1 || this.state.data.question.categoryId == 2) {
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
 
  fetchDashboardCardData = () => {
    let url = "http://localhost:8080/QuizWit/ExamDashboardCards";
    Request.get(url)
    .then((res) => {
      if(res.success) {
        this.setState({
          dashboardCardData: res.dashboardCardData
        })
      }
    })
  }

  fetchQuestion = () => {
    if(this.state.fetchQuestionId != 0) {
      let url = "http://localhost:8080/QuizWit/ExamNavigation?fetchQuestionNavigationId=";
      url += this.state.fetchQuestionId;
      Request.get(url)
      .then((res) => {
          if(res.success) {
            if(!res.data.error) {
              this.setState({
                data: res.data,
                setQuestionTimer: res.data.question.setQuestionTimer,
                questionNavigation: res.data.questionNavigation,
                sectionNavigation: res.data.sectionNavigation,
                currentQuestionNavigationId: res.data.question.navigationId,
                questionLoaded: true
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

  checkCurrentQuestionNavigator = () => {
    let id = 'navigation' + this.state.currentQuestionNavigationId;
    console.log(id);
    let el = document.getElementById(id);
    el.checked = true;
  }

  highlightQuestionNavigationStatus = () => {
    //
    let url = "http://localhost:8080/QuizWit/LoadQuestionNavigationStatus";
    
    Request.get(url)
    .then((res) => {
      if(res.success) {
        let questions = res.questions;
        for(let i=0; i<questions.length; i++) {
          let id = 'navigationStatus' + questions[i].navigationId;
          let el = document.getElementById(id);
          let className = '';
          if(questions[i].attempted == '1')
            className = 'attempted-question';
          else if(questions[i].markedAsReview == '1')
            className = 'marked-as-review-question';
          
          el.className = className;

        }
      }
    })
  }

  renderQuestion = () => {

    if(this.state.questionTimer) {
      this.state.questionTimer.stop();
    }
    if(this.state.setQuestionTimer) {
      let timerId = 'questionTimer' + this.state.currentQuestionNavigationId;
      this.state.questionTimer = new Timer();
      if(this.state.data.lastQuestion) {
        this.state.questionTimer.set(this.state.data.timeDuration, timerId, this.endExam);
      }
      else if(this.state.data.lastQuestionOfSection && !this.state.sectionNavigation) {
        this.state.questionTimer.set(this.state.data.timeDuration, timerId, this.submitSection);
      }
      else {
        this.state.questionTimer.set(this.state.data.timeDuration, timerId, this.nextQuestion);
      }
      this.state.questionTimer.start();
    }

    this.setState({
    }, () => {
      this.checkCurrentQuestionNavigator();
      this.fetchDashboardCardData();
      this.hideSubmitSectionDialog();
      this.hideSubmitQuestionDialog();
      this.highlightQuestionNavigationStatus();
    })
  }

  startExam = () => {
    let url = "http://localhost:8080/QuizWit/StartExam";
    Request.get(url)
    .then((res) => {
        if(res.success) {
          this.fetchNavigationDetails(res);
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


  fetchNavigationDetails = (response) => {
    let url = 'http://localhost:8080/QuizWit/FetchSectionAndQuestionNavigationDetails';
    Request.get(url)
    .then((res) => {
        if(res.success) {
            let data = res.sections;
            for(let i=0; i<data.length; i++) {
                let questions = data[i].questions;
                data[i]["viewDuration"] = (new TimeToString(data[i].duration)).convert();
                for(let j=0; j<questions.length; j++) {
                    questions[j]["serialNo"] = j+1;
                }
                data[i].questions = questions;
            }
            this.setState({
                sections: data
            }, () => {
              this.setState({
                start: true,
                entireExamTimeDuration: response.entireExamTimeDuration,
                examTitle: response.examTitle,
                setExamTimer: response.setExamTimer,
                data: response.data,
                setQuestionTimer: response.data.question.setQuestionTimer,
                questionNavigation: response.data.questionNavigation,
                sectionNavigation: response.data.sectionNavigation,
                currentQuestionNavigationId: response.data.question.navigationId
              }, () => {
                this.renderQuestion();
              });
            });
        }
        else {
            Flash.message(res.error, 'bg-danger');
        }
    })
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
                                  sections={this.state.sections}
                                />
                            </div>
                            <div className='content-wrapper m-10'>
                                <div className='content-loaded' style={{height: "100%"}}>
                                    <div className='flex-row'>
                                        <div className='dashboard-card-container'>
                                            <DashboardCard title="Total Questions" value={this.state.dashboardCardData.totalQuestions} icon="fas fa-users-cog" color="linear-gradient(45deg,rgb(91, 138, 170), rgb(63 155 218))" />
                                            <DashboardCard title="Attempted" value={this.state.dashboardCardData.attemptedQuestions} icon="fas fa-check" color="linear-gradient(45deg, rgb(102, 144, 105), rgb(88 180 95))" />
                                            <DashboardCard title="Marked as Review" value={this.state.dashboardCardData.markedAsReviewQuestions} icon="fas fa-calendar" color="linear-gradient(45deg, rgb(195, 83, 126),rgb(226 54 120))"/>
                                            <DashboardCard title="Unattempted" value={this.state.dashboardCardData.unattemptedQuestions} icon="fas fa-users" color="linear-gradient(45deg, rgb(184, 102, 102), rgb(230 76 76))" /> 
                                        </div>
                                    </div>
                                    <div className='question-header'>
                                      {
                                        this.state.data.question.attempted &&
                                        <i className='fas fa-bookmark success'></i>
                                      }
                                      {
                                        this.state.data.question.unattempted &&
                                        <i className='fas fa-bookmark danger'></i>
                                      }
                                      {
                                        this.state.data.question.markedAsReview &&
                                        <i className='fas fa-bookmark tertiary'></i>
                                      }
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
                                          <div className='flex-row ai-c'>
                                            <span>Score: {this.state.data.question.score}</span>
                                            <span className='gray mr-10 ml-10'>|</span>
                                            <span>Negative: {this.state.data.question.negative}</span>
                                              {
                                                this.state.setQuestionTimer &&
                                                <div id={'questionTimer' + this.state.currentQuestionNavigationId} className='timer ml-10'></div>
                                              }
                                            <div style={{width: "40px"}}></div>
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
                                            clearResponse={this.clearResponse}
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