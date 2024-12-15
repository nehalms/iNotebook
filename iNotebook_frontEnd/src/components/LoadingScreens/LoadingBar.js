import React, { useEffect, useState } from 'react'
import './LoadingBar.css'

export default function LoadingBar(props) {

    const [degree, setDegree] = useState(0);

    useEffect(() => {
        let circle = document.getElementById('circle');
        let deg = 0;
        let color = '#85ff21'
        var interval = setInterval(() => {
            deg += 2;
            setDegree(deg);
            circle.style.background = `conic-gradient(${color} ${deg}%, #222 0%)`
            if(deg >= 100) {
                clearInterval(interval);
                return;
            }
        }, 500);
    }, [])

  return (
    <div className='loading-bar'>
        <div className="circle-bar" id='circle'>
            <h4 className="number-bar" id='num'>{degree < 100 ? degree : 'Wait'}<span>{degree < 100 ? '%' : ''}</span></h4>
            <h6 className="number-bar">{props.msg || 'Loading...'}</h6>
        </div>
    </div>
  )
}
