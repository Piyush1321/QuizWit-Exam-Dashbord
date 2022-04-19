import React from 'react';
import '../../css/TrueFalse.css';
class TrueFalse extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        let el = document.getElementsByName('trueFalseAnswer');
        for(let i=0; i<el.length; i++)
            el[i].checked = false;
    }

    render = () => {
        return (
            <div className='true-false-option'>
                <h3 className='gray'>Select Answer</h3>
                <div>
                    <label>
                        <input type="radio" name='trueFalseAnswer' defaultValue="TRUE" />
                        <span>True</span>
                    </label>
                    <label>
                        <input type="radio" name='trueFalseAnswer' defaultValue="FALSE"/>
                        <span>False</span>
                    </label>
                </div>
                <div className="response"></div>
            </div>
        );
    }
}

export default TrueFalse;