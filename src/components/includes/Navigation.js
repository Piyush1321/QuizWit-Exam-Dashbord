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
                                        navigateToParticularQuestion={this.props.navigateToParticularQuestion}
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