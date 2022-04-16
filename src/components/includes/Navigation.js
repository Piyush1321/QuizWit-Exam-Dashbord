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
            sections: []
        }
    }


    fetchNavigationDetails = () => {
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
                console.log(data);
                this.setState({
                    sections: data
                });
            }
            else {
                Flash.message(res.error, 'bg-danger');
            }
        })
    }

    componentDidMount = () => {
        let height = document.getElementsByTagName('body')[0].offsetHeight - 44 - 32;
        document.getElementById('entity-holder').style.height = height + 'px';
        this.fetchNavigationDetails();
    }

    render = () => {
        return (
            <>
                <div className='navigation'>
                    <h3>
                        <div className='primary'>Sections</div>
                    </h3>
                    <div className='sections'>
                        <div id='entity-holder'>
                            {
                                this.state.sections.map((d, k) => {
                                    return <Section 
                                        key={k}
                                        title={d.title}
                                        sectionId={d.sectionId}
                                        questions={d.questions}
                                        duration={d.duration}
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