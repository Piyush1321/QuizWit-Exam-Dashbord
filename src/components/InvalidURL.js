import React from 'react';
import './css/InvalidURL.css';

class InvalidURL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = () => {
    }

    render = () => {
        return (
            <>
                <div className='invalid-url-wrapper'>
                    <div>
                        <div className='error-404'>
                            <div className='primary'>4</div>
                            <div className='secondary'>0</div>
                            <div className='danger'>4</div>
                        </div>
                        <div className='error-text danger'>Error</div>
                    </div>
                    <div>
                        <i className='fas fa-exclamation-circle danger'></i>
                        <h1 className='mt-20'>Invalid URL</h1>
                        <div className='error mt-10'>The page you are looking for doesn't exist.</div>
                        <div className='mt-10'>Please check URL</div>
                        <div className='mt-10'>If the problem persist write your query here. <a href='' style={{textDecoration: "underline"}}>Contact Us</a></div>
                    </div>
                </div>

            </>
        );
    }
    
}

export default InvalidURL;
