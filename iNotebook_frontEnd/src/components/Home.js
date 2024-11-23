import React, { Suspense, useEffect, useState } from 'react';
import { history } from './History';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Home.css';
import loading_gif from './loading.gif';
const UserHistoryTable = React.lazy(() => import('./Tables/UserHistorytable'));

const Home = (props) => {
  history.navigate = useNavigate();
  const [userHistory, setHistory] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
        props.showAlert('Session expired, login again', 'danger');
        history.navigate('/login');
        return;
      }
      getSecretKey();
      fetchHistory();
    } else {
      props.showAlert('Please log in', 'warning');
      history.navigate('/login');
    }
  }, []);

  const getSecretKey = async () => {
    try {
      if (sessionStorage.getItem('AesKey')) return;
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/aes/secretKey`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
      });
      const json = await response.json();
      if (json.status === 'success') sessionStorage.setItem('AesKey', json.secretKey);
    } catch (err) {
      console.error('Error fetching secret key:', err);
    }
  };

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
      props.showAlert('Error fetching history', 'info');
      console.error('Error fetching history:', error);
    }
  };

  const handleDeleteHistory = async () => {
    try {
      props.setLoader({ showLoader: true, msg: 'Deleting history...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        method: 'DELETE',
        headers: { 'auth-token': localStorage.getItem('token') },
      });
      const data = await response.json();
      if(data) fetchHistory();
    } catch (error) {
      props.showAlert('Error deleting history', 'info');
      console.error('Error deleting history:', error);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  return (
    <div className="home-container">
      <div className="feature-grid">
        {[
          { name: 'Save Notes', route: '/notes', icon: 'fa-book', color: '#4CAF50' },
          { name: 'Image Editor', route: '/imEdit', icon: 'fa-image', color: '#FF9800' },
          { name: 'Games', route: '/games', icon: 'fa-gamepad', color: '#2196F3' },
          { name: 'Hide Messages', route: '/msg', icon: 'fa-envelope', color: '#F44336' },
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
