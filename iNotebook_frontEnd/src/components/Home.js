import React, { useEffect, useState } from 'react'
import { history } from './History';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import './Home.css';
import UserHistoryTable from './Tables/UserHistorytable';
import loading_gif from './loading.gif'

const Home = (props) => {
  history.navigate = useNavigate();
  const [userHistory, setHistory] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(localStorage.getItem('token')){
      if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
        props.showAlert("Session expired Login again", 'danger');
        history.navigate("/login");
        return;
      }
      fetchHistory();
      getSecretKey();
    }
    else {
      props.showAlert("Login please", 'warning');
      history.navigate("/login");
      return;
    }
  }, [])

  const getSecretKey = async () =>{
    try{
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/aes/secretKey`, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if(json.status === 'success') {
        let decryptKey = ''
        Array.from(json.secretKey).forEach(char => {
            decryptKey += String.fromCharCode(char.charCodeAt(0) / 541);
        });
        localStorage.setItem('AesKey', decryptKey);
      }
    } catch (err) {
      console.log("Error**", err);
    }
  }

  const fetchHistory = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        headers: {
          'auth-token': localStorage.getItem('token'),
        }
      });
      const data = await response.json();
      if(data.error) {
        props.showAlert(data.error, 'danger');
        return;
      }
      setHistory(data);
      setLoading(false);
    } catch (error) {
      props.showAlert("Error in fetching history", 'info');
      console.log("Error***", error);
    }
  }

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
      <div className='col-lg-3'>
        <div className="card shadow-lg my-3 Games__left-right" onClick={() => {history.navigate('/games')}}>
          <div className="card-body">
            <h5 className='text-center'>Games</h5>
          </div>
        </div>
      </div>
      <div className='col-lg-3'>
        <div className="card shadow-lg my-3 Msg__left-right" onClick={() => {history.navigate('/msg')}}>
          <div className="card-body">
            <h5 className='text-center'>Hide Messages</h5>
          </div>
        </div>
      </div>
      <div className='col-lg-12'>
        <div className="card shadow-lg my-3">
          <div className="card-body text-center">
            <h4 className='text-center p-2 border rounded'>User History</h4>
            {loading ? <img src={loading_gif}/> : <UserHistoryTable data={userHistory}/>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
