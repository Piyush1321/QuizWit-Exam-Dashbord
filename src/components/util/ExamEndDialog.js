import React from 'react';
import '../css/ExamEndDialog.css';

class ExamEndDialog extends React.Component {
    constructor(props) {
        super(props);
    }

    closeDialog = () => {
        document.getElementById('exam-end-dialog').style.display = 'none';
        document.getElementById('route-overlay').style.display = 'none';
    }

    componentDidMount = () => {
    }

    render = () => {
        return (
            <>
                <div id='exam-end-dialog'>
                    <div className='flex-col' style={{height: "100%"}}>
                        <div className='danger'>
                            <h1><i className='fas fa-exclamation-circle'></i> Are you sure</h1>
                        </div>
                        <div className='flex-full mt-20'>
                            <p>Please click on checkbox.</p>
                            <div className='flex-row ai-c mt-10'>
                                <input type='checkbox' id='submit-exam-checkbox' className='mr-10'/>
                                Submit exam
                            </div>
                        </div>
                        <div className='btn-container flex-row jc-sb'>
                            <button className='btn btn-fade btn-small' onClick={this.closeDialog}>Cancel</button>
                            <button className='btn btn-danger btn-small' onClick={this.props.endExamViaDialog}>Submit</button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ExamEndDialog;