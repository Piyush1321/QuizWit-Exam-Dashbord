import React from 'react';
import '../../css/MCQOption.css';

class MCQMultipleCorrect extends React.Component {
    constructor(props) {
        super(props);
        let options = this.props.mcqOptions;
        let serial = 65;
        for(let i=0; i<options.length && i<26; i++) {
            options[i]["serial"] = String.fromCharCode(serial);
            serial += 1;
        }
        this.state = {
            mcqOptions: options
        }
    }

    componentDidMount = () => {
        document.getElementById('clear-response-btn-container').style.display = 'none';
        let options = document.getElementsByName('mcqOption');
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
                <div className='mcq-options'>
                    <h3 className='gray'>Options</h3>
                    {
                        this.state.mcqOptions.map((d, k) => {
                            return <label key={k}>
                                <input type='checkbox' name='mcqOption' defaultValue={d.optionId} defaultChecked={d.selected}/>
                                <span>
                                    <div className='option-serial'>{d.serial}.</div>
                                    <div>{d.option}</div>
                                </span>
                            </label>
                        })
                    }
                </div>
                <div className='flex-row jc-e mt-10' id='clear-response-btn-container'>
                    <button className='btn btn-fade btn-small ml-10' onClick={this.props.clearResponse}>Clear Response</button>
                </div>
            </>
        );
    }
}

export default MCQMultipleCorrect;