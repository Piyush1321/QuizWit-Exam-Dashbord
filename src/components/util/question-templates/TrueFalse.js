import React from 'react';
import '../../css/TrueFalse.css';
class TrueFalse extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        document.getElementById('clear-response-btn-container').style.display = 'none';
        let options = document.getElementsByName('trueFalseAnswer');
        for(let i=0; i<options.length; i++) {
            if(options[i].checked)
                document.getElementById('clear-response-btn-container').style.display = 'flex';
            options[i].addEventListener('click', () => {
                document.getElementById('clear-response-btn-container').style.display = 'flex';
            })
        }
    }

    render = () => {
        return (
            <>
                <div className='true-false-option'>
                    <h3 className='gray'>Select Answer</h3>
                    <div>
                        <label>
                            <input type="radio" name='trueFalseAnswer' defaultValue="TRUE" defaultChecked={this.props.trueFalseAnswer == "TRUE" ? true : false}/>
                            <span>True</span>
                        </label>
                        <label>
                            <input type="radio" name='trueFalseAnswer' defaultValue="FALSE" defaultChecked={this.props.trueFalseAnswer == "FALSE" ? true : false}/>
                            <span>False</span>
                        </label>
                    </div>
                    <div className="response"></div>
                </div>
                <div className='flex-row jc-e mt-10' id='clear-response-btn-container'>
                    <button className='btn btn-fade btn-small ml-10' onClick={this.props.clearResponse}>Clear Response</button>
                </div>
            </>
            
        );
    }
}

export default TrueFalse;