import React, { useState } from 'react'
import OptionsMenu from '../Utils/OptionsMenu'
import RoundCorners from './RoundCorners';
import Enhance from './Enhance';

export default function ImageEditor(props) {
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
      <div className='mb-2'>
        <button className='btn btn-warning my-2' type='button' role='button' onClick={toggleNav} style={{position: 'relative', left: '0px', top: '0px'}}><i className="me-2 fa-solid fa-bars"></i>Menu</button>
        <OptionsMenu isOpen={isOpen} toggleNav={toggleNav} changeCompStr={changeCompStr} optionList={options}/>
        <h6 className='text-danger'>* Please note Images uploaded are not saved with us</h6>
      </div>
      
      <div>
        {compStr === 'roundcorners' && <RoundCorners showAlert={props.showAlert} setLoader={props.setLoader}/>}
        {compStr === 'enhance' && <Enhance showAlert={props.showAlert} setLoader={props.setLoader}/>}
      </div>
    </div>
  )
}
