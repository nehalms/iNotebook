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
    }
    else {
      props.showAlert("Login please", 'warning');
      history.navigate("/login");
      return;
    }
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        headers: {
          'auth-token': localStorage.getItem('token'),
        }
      });
      const data = await response.json();
      console.log(data);
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
