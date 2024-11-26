import React from 'react';
import './Spinner.css';

const LoadingScreen = (props) => {
    return (
        <div className="loading-screen">
            <div className="spinner">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
            <h5 className='loading-screen-h5'>{props.msg ? props.msg : 'Loading, please wait...'}</h5>
        </div>
    );
};

export default LoadingScreen;