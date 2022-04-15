import React from 'react';
import '../css/Navigation.css';

import Section from '../util/Section';

class Header extends React.Component {
  
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        let height = document.getElementsByTagName('body')[0].offsetHeight - 44 - 32;
        document.getElementById('entity-holder').style.height = height + 'px';
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
                            <Section />
                            <Section />
                            <Section />
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Header