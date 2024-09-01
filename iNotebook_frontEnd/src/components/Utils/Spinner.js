import React from 'react';
import './LoadingScreen.css'; 

const LoadingScreen = (props) => {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h5>{props.msg}</h5>
      </div>
    );
};

export default LoadingScreen;