import React from 'react';
import './Spinner.css'; 

const LoadingScreen = (props) => {
    return (
      <div className="loading-screen">
        <div className="circle">
          <div className='dots'></div>
        </div>
        <h5>{props.msg}</h5>
      </div>
    );
};

export default LoadingScreen;