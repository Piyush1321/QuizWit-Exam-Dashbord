import React from 'react';
import '../css/Header.css';
import Timer from '../services/Timer';
import Request from '../services/Request';
import Flash from '../services/Flash';

class Header extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            entireExamTime: this.props.duration,
            fullScreen: false
        }
    }

    exitFullScreenMode = () => {
        if (document.exitFullscreen) {
          document.exitFullscreen()
          .then(() => {
              this.setState({
                  fullScreen: false
              })
          })
          .catch((err) => {
              Flash.message(err, 'bg-error');
          });
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen()
          .then(() => {
              this.setState({
                  fullScreen: false
              })
          })
          .catch((err) => {
              Flash.message(err, 'bg-error');
          });
        } else if (document.msExitFullscreen) { /* IE11 */
          document.msExitFullscreen()
          .then(() => {
              this.setState({
                  fullScreen: false
              })
          })
          .catch((err) => {
              Flash.message(err, 'bg-error');
          });
        }
    }

    viewInFullScreen = () => {
        let elem = document.body;
        if (elem.requestFullscreen) {
          elem.requestFullscreen()
          .then(() => {
              this.setState({
                  fullScreen: true
              })
          })
          .catch((err) => {
              Flash.message(err, 'bg-error');
          });
        } else if (elem.webkitRequestFullscreen) { /* Safari */
          elem.webkitRequestFullscreen()
          .then(() => {
              this.setState({
                  fullScreen: true
              })
          })
          .catch((err) => {
              Flash.message(err, 'bg-error');
          });
        } else if (elem.msRequestFullscreen) { /* IE11 */
          elem.msRequestFullscreen()
          .then(() => {
              this.setState({
                  fullScreen: true
              })
          })
          .catch((err) => {
              Flash.message(err, 'bg-error');
          });
        }
    }
    componentDidMount = () => {
        if(this.props.setExamTimer) {
            document.getElementById('entire-exam-timer-block').className = 'timer';
            const timer = new Timer();
            timer.set(this.state.entireExamTime, 'entire-exam-timer-block', this.props.endExam);
            timer.start();
        }
    }

    render = () => {
        return (
            <div className='main-header'>
                <div className='flex-row jc-sb ai-c'>
                    <div className='webapp flex-row ai-c'>
                        <a href='http://localhost:3000'>
                            <img src='images/logo/logo.png' className='logo' />
                        </a>
                        <div className='ml-10 secondary'>{this.props.examTitle}</div>
                    </div>
                    <div className='flex-row ai-c'>
                        <div className='flex-row ai-c'>
                            <div id='candidate-name' className='mr-10'>Ishwar Baisla</div>
                            <div id='entire-exam-timer-block'></div>
                            {
                                !this.state.fullScreen &&
                                <button className='btn btn-small ml-10 flex-row jc-c' onClick={this.viewInFullScreen}><i className='fas fa-expand'></i></button>
                            }
                            {
                                this.state.fullScreen &&
                                <button className='btn btn-small ml-10 flex-row jc-c' onClick={this.exitFullScreenMode}><i className='fas fa-compress'></i></button>
                            }
                            <button className='btn btn-danger btn-small ml-10' onClick={this.props.showEndExamDialog}>End Exam</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header