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

    render = () => {
        return (
            <div className='mcq-options'>
                <h3 className='gray'>Options</h3>
                {
                    this.state.mcqOptions.map((d, k) => {
                        return <label>
                            <input type='checkbox' name='mcqOption' defaultValue={d.optionId} />
                            <span>
                                <div className='option-serial'>{d.serial}.</div>
                                <div>{d.option}</div>
                            </span>
                        </label>
                    })
                }
            </div>
        );
    }
}

export default MCQMultipleCorrect;