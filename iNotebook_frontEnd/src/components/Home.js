import React, { useEffect } from 'react'
import { history } from './History';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './Home.css';

const Home = (props) => {
  history.navigate = useNavigate();

  useEffect(() => {
    if(localStorage.getItem('token')){
      if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
        props.showAlert("Session expired Login again", 'danger');
        history.navigate("/login");
      }
    }
    else {
      props.showAlert("Login please", 'warning');
      history.navigate("/login");
    }
  }, [])

  return (
    <div className='row my-2'>
      <div className='col-lg-3'>
        <div className="card shadow-lg my-3 SaveNotes__left-right" onClick={() => {history.navigate('/notes')}}>
          <div className="card-body">
            <h5 className='text-center'>Save Notes</h5>
          </div>
        </div>
      </div>
      <div className='col-lg-3'>
        <div className="card shadow-lg my-3 ImagesEdit__left-right" onClick={() => {history.navigate('/imEdit')}}>
          <div className="card-body">
            <h5 className='text-center'>Image Editor</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
