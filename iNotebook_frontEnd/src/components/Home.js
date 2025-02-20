import React, { Suspense, useEffect, useState } from 'react';
import { history } from './History';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Home.css';
import loading_gif from './loading.gif';
import Confirmation from '../components/Utils/Confirmation';
import { getSecretKey } from '../components/Requests/getSecretKey'
const UserHistoryTable = React.lazy(() => import('./Tables/UserHistorytable'));

const Home = (props) => {
  history.navigate = useNavigate();
  const [userHistory, setHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    onConfirm: () => {},
    onClose: () => {},
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
        props.showAlert('Session expired, login again', 'danger', 10001);
        history.navigate('/login');
        return;
      }
      getSecretKey();
      fetchHistory();
    } else {
      props.showAlert('Please log in', 'warning', 10002);
      history.navigate('/login');
    }
  }, []);


  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      const data = await response.json();
      if (data.error) {
        props.showAlert(data.error, 'danger');
        return;
      }
      setHistory(data);
      setLoading(false);
    } catch (error) {
      props.showAlert('Error fetching history', 'info', 10003);
      console.error('Error fetching history:', error);
    }
  };

  const deleteHistory = async () => {
    try {
      props.setLoader({ showLoader: true, msg: 'Deleting history...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        method: 'DELETE',
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      const data = await response.json();
      if(data) fetchHistory();
      setDialog({
        open: false,
      });
    } catch (error) {
      props.showAlert('Error deleting history', 'info', 10004);
      console.error('Error deleting history:', error);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }
  
  const onClose = () => {
    setDialog({
      open: false, 
    });
    return;
  }

  const handleDeleteHistory = () => {
    setDialog({
      open: true, 
      title: 'Delete History',
      onConfirm: deleteHistory,
      onClose: onClose,
    });
  }
  

  return (
    <div className="home-container">
      {dialog.open && <Confirmation open={dialog.open} title={dialog.title} onConfirm={dialog.onConfirm} onClose={dialog.onClose} />}
      <div className="feature-grid">
        {[
          { name: 'Save Notes', route: '/notes', icon: 'fa-book', color: '#4CAF50' },
          { name: 'Tasks / To-Do list', route: '/tasks', icon: 'fa-pen', color: '#FF9800' },
          { name: 'Image Editor', route: '/imEdit', icon: 'fa-image', color: '#2196F3' },
          { name: 'Games', route: '/games', icon: 'fa-gamepad', color: '#F44336' },
          { name: 'Hide Messages', route: '/msg', icon: 'fa-envelope', color: '#904caf' },
        ].map((feature, index) => (
          <div
            key={index}
            className="feature-card"
            style={{ backgroundColor: feature.color }}
            onClick={() => history.navigate(feature.route)}
          >
            <i className={`fa ${feature.icon} feature-icon`}></i>
            <h5 className="feature-name">{feature.name}</h5>
          </div>
        ))}
      </div>

      <div className="history-section">
        {userHistory && userHistory.length ? <i className="fa-solid fa-trash mx-2 text-danger"  style={{display: 'inline', float: 'right', marginTop: '10px'}} onClick={handleDeleteHistory}></i> : <></>}
        <h4 className="history-title">User History</h4>
        {loading ? (
          <img src={loading_gif} alt="Loading..." className="loading-gif" />
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <UserHistoryTable data={userHistory} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default Home;
