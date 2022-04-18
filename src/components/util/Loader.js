import React from 'react';


class Loader extends React.Component {
    constructor(props) {
        super(props);
    }
    render = () => {
        return (
        
          <div className='loader-container'>
              <div className='loader'></div>
              <p className='mt-10 primary'>{this.props.value}</p>
          </div>
        );
    }
}

export default Loader;