import React from 'react';
import '../css/SubmitQuestionDialog.css';

class SubmitQuestionDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <>
                <div id='submit-question-dialog'>
                    <div className='flex-col' style={{height: "100%"}}>
                        <div className='danger'>
                            <h1><i className='fas fa-exclamation-circle'></i> Are you sure</h1>
                        </div>
                        <div className='flex-full mt-20'>
                            <p>You won't be able to access the question once you click on submit.</p>
                            <br/>
                            <p className='primary'>Submit question to continue</p>
                        </div>
                        <div className='btn-container flex-row jc-sb'>
                            <button className='btn btn-fade btn-small' onClick={this.props.closeDialog}>Cancel</button>
                            <button className='btn btn-danger btn-small' onClick={this.props.submitQuestion}>Submit</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SubmitQuestionDialog;