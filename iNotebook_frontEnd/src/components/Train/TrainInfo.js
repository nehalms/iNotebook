import React, { useState } from 'react'
import OptionsMenu from '../Utils/OptionsMenu'

export default function TrainInfo(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [compStr, setCompStr] = useState('roundcorners');
  const options =  {
    'Round Corners': 'roundcorners',
    'Enhance image': 'enhance'
  };
  
  const toggleNav = () => {
    setIsOpen(!isOpen);
  }

  const changeCompStr = (str)=> {
    setCompStr(str);
  }

  return (
    <div>
      {/* <div className='mb-2'>
        <button className='btn btn-info my-2' type='button' role='button' onClick={toggleNav} style={{position: 'relative', left: '0px', top: '0px'}}><i className="me-2 fa-solid fa-bars"></i>Menu</button>
        <OptionsMenu isOpen={isOpen} toggleNav={toggleNav} changeCompStr={changeCompStr} optionList={options}/>
      </div> */}
      
      <div className='bg-dark'>
        <h1 className='m-0 p-2 text-center text-light'>Under development</h1>
      </div>
    </div>
  )
}