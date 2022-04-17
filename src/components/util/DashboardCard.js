import React from 'react';
import '../css/DashboardCard.css';

class DashboardCard extends React.Component {
    constructor(props) {
        super(props);
    }
    render = () => {
        return (
          <div className='dashboard-card' style={{"background": this.props.color}}>
              <div className='flex-row jc-sb'>
                  <div>
                      <div className='card-title'>{this.props.title}</div>
                      <div className='card-value'>{this.props.value}</div>
                      <div className='card-bar'></div>
                  </div>
                  <div>
                      <i className={this.props.icon}></i>
                  </div>
              </div>
              <div className='left-line'></div>
              <div className='circle-1'></div>
              <div className='circle-2'></div>
          </div>
        )
    }
}

export default DashboardCard;