import React, { useEffect, useState, useContext } from 'react'
import OptionsMenu from '../Utils/OptionsMenu'
import RoundCorners from './RoundCorners';
import Enhance from './Enhance';
import LoadingBar from '../LoadingScreens/LoadingBar';
import GenerativeBackground from './GenerativeBackground';
import RotateImage from './RotateImage';
import Shapen from './Shapen';
import { history } from '../History';
import AuthContext from '../../context/auth_state/authContext';

export default function ImageEditor(props) {
  const { handleSessionExpiry } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const { userState } = useContext(AuthContext);
  const [compStr, setCompStr] = useState('roundcorners');
  const [loader, setLoader] = useState({ showLoader: false, msg: ""});
  const options =  {
    'Round Corners': 'roundcorners',
    'Enhance image': 'enhance',
    'Generative Background': 'generativebackground',
    'Rotate Image': 'rotateimage',
    'Sharpen': 'sharpen'
  };

  useEffect(() => {
    if (!userState.loggedIn) {
      history.navigate("/");
      return;
    }
  }, [])
  
  const toggleNav = () => {
    setIsOpen(!isOpen);
  }

  const changeCompStr = (str)=> {
    setCompStr(str);
  }

  const handleDelete = async () => {
    try{  
      props.setLoader({ showLoader: true, msg: "Deleting images..."});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/image/delete`, {
        method: "DELETE", 
        headers: {
          },
        credentials: 'include',
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if(json.error) {
        props.showAlert(json.error, 'danger', 10131)
        handleSessionExpiry(json);
        return;
      }
      if(json.success) {
        props.showAlert(json.data.msg, 'success', 10132);
      } else {
        props.showAlert(json.msg, 'info', 10133);
      }
      return;
    } catch(err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger', 10134);
    }
  }

  return (
    <div>
      <div className='mb-2'>
        <button className='btn btn-warning my-2 mx-2' type='button' role='button' onClick={toggleNav} style={{position: 'relative', left: '0px', top: '0px'}}><i className="me-2 fa-solid fa-bars"></i>Menu</button>
        <button className='btn btn-danger my-2 mx-2' type='button' role='button' onClick={handleDelete} style={{position: 'relative', left: '0px', top: '0px'}}>Delete Images<i className="fa-solid fa-trash-can ms-2"></i></button>
        <h6 id="emailHelp" className="d-inline m-0 text-danger p-1 text-center">(Use this <strong>Delete Images</strong> button to delete images in server)</h6>
        <OptionsMenu isOpen={isOpen} toggleNav={toggleNav} changeCompStr={changeCompStr} optionList={options}/>
        <h6 className='text-danger'>* Please note Images uploaded are not saved with us</h6>
      </div>
      {loader.showLoader && <LoadingBar msg={loader.msg}/>}
      
      <div>
        {compStr === 'roundcorners' && <RoundCorners showAlert={props.showAlert} setLoader={setLoader}/>}
        {compStr === 'enhance' && <Enhance showAlert={props.showAlert} setLoader={setLoader}/>}
        {compStr === 'generativebackground' && <GenerativeBackground showAlert={props.showAlert} setLoader={setLoader}/>}
        {compStr === 'rotateimage' && <RotateImage showAlert={props.showAlert} setLoader={setLoader}/>}
        {compStr === 'sharpen' && <Shapen showAlert={props.showAlert} setLoader={setLoader}/>}
      </div>
    </div>
  )
}
