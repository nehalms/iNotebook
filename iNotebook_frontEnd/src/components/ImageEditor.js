import React, { useState } from 'react'
import ImageEditorNavbar from './ImageEditorNavbar'
import RoundCorners from './RoundCorners';
import Enhance from './Enhance';

export default function ImageEditor(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [compStr, setCompStr] = useState('roundcorners');
  
  const toggleNav = () => {
    setIsOpen(!isOpen);
    console.log(isOpen)
  }

  const changeCompStr = (str)=> {
    console.log(str);
    setCompStr(str);
  }

  return (
    <div>
      <div className='mb-2'>
        <button className='btn btn-warning my-2' type='button' role='button' onClick={toggleNav} style={{position: 'relative', left: '0px', top: '0px'}}><i class="me-2 fa-solid fa-bars"></i>Menu</button>
        <ImageEditorNavbar isOpen={isOpen} toggleNav={toggleNav} changeCompStr={changeCompStr}/>
      </div>
      
      <div>
        {compStr === 'roundcorners' && <RoundCorners showAlert={props.showAlert} setLoader={props.setLoader}/>}
        {compStr === 'enhance' && <Enhance showAlert={props.showAlert} setLoader={props.setLoader}/>}
      </div>
    </div>
  )
}
