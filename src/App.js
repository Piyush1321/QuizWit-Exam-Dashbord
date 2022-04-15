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

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        examId: 0,
        validURL: false,
        login: false,
        start: false,
        studentDetails: {},
        error: ''
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
            login: false,
            validURL: false
          })
          Flash.message(res.success, 'bg-success');
        }
        else {
            Flash.message(res.error, 'bg-danger');
        }
    })
}


  startExam = () => {
    this.setState({
      start: true
    })
  }

  componentDidMount = () => {
    this.login();
    let pathname = window.location.pathname;
    pathname = pathname.substr(1, pathname.length);
    if(isNaN(pathname)) {
    }
    else {
        pathname = parseInt(pathname);
        if(pathname > 0) {
          this.setState({
              examId: pathname,
              validURL: true
          })
        }
    }
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
                        <Header />
                        <div className='body-wrapper'>
                            <div className='navigation-wrapper'>
                                <Navigation />
                            </div>
                            <div className='content-wrapper'>
                                <div className='content-loaded'>
                                    <div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                      </>
                    }
                    {
                      !this.state.start &&
                      <ExamDetails startExam={this.startExam} logout={this.logout} studentDetails={this.state.studentDetails}/>
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
        
      </div>
    )
  }
}

export default App