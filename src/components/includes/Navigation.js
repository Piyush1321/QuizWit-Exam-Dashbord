import React from 'react';
import '../css/Navigation.css';
import Flash from '../services/Flash';
import Request from '../services/Request';
import TimeToString from '../services/TimeToString';
import Section from '../util/Section';

class Header extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
            sections: this.props.sections
        }
    }



    componentDidMount = () => {
    }

    render = () => {
        return (
            <>
                <div className='navigation'>
                    <h3 style={{height: "40px", borderBottom: "0.5px solid rgba(0, 0, 0, 0.4)"}} className='flex-row jc-sb pb-10'>
                        <div>
                            <div className='primary' style={{fontWeight: "5"}}>Sections</div>
                            <div style={{fontSize: "15px"}}>
                                <span className='gray mr-5'>Navigation</span> {this.props.sectionNavigation ? <span className='success' style={{fontWeight: "5"}}>On</span> : <span className='danger' style={{fontWeight: "5"}}>Off</span>}
                            </div>
                        </div>
                        <div>
                            {
                                this.state.sections.map((d, k) => {
                                    return <div className='timer' id={'sectionTimer' + d.sectionNavigationId}></div>
                                })
                            }
                        </div>
                    </h3>
                    <div className='sections'>
                        <div id='entity-holder'>
                            {
                                this.state.sections.map((d, k) => {
                                    return <Section 
                                        key={k}
                                        title={d.title}
                                        sectionId={d.sectionId}
                                        questionNavigation={d.questionNavigation}
                                        sectionNavigationId={d.sectionNavigationId}
                                        questions={d.questions}
                                        duration={d.duration}
                                        submitSection={this.props.submitSection}
                                        navigateToParticularQuestion={this.props.navigateToParticularQuestion}
                                        currentSectionId={this.props.currentSectionId}
                                        currentQuestionNavigationId={this.props.currentQuestionNavigationId}
                                    />
                                })
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Header