import React, { useEffect, useState } from 'react';
import './ComponentLoader.css';

const ComponentLoader = ({ message }) => {
    const [ellipsis, setEllipsis] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setEllipsis(prev => prev.length < 3 ? prev + '.' : '');
        }, 500);
        
        const progressInterval = setInterval(() => {
            if (progress < 100) {
                setProgress(prev => prev + 1);
            }
        }, 50);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, [progress]);

    return (
        <div className="component-loader-container">
            <div className="board-container">
                <div className="board infinite-zoom box-1"></div>
                <div className="board infinite-zoom box-2 delay-1"></div>
                <div className="board infinite-zoom box-3 delay-2"></div>
                <div className="board infinite-zoom box-4 delay-3"></div>
            </div>
            <h5 className='component-loader-container-h5'>{message || `Loading component${ellipsis}`}</h5>
        </div>
    );
};

export default ComponentLoader;
