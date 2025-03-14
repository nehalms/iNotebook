import React, { Suspense, useContext, useEffect, useState } from 'react';
import { history } from './History';
import './Home.css';
import loading_gif from './loading.gif';
import Confirmation from '../components/Utils/Confirmation';
import { useSecretKey } from '../components/Requests/getSecretKey'
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth_state/authContext';
const UserHistoryTable = React.lazy(() => import('./Tables/UserHistorytable'));

const Home = (props) => {
  history.navigate = useNavigate();
  const { userState, fetchUserState, handleSessionExpiry } = useContext(AuthContext);
  const { getSecretKey } = useSecretKey();
  const [userHistory, setHistory] = useState();
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    onConfirm: () => {},
    onClose: () => {},
  });
  const Features = [
    { id: 'notes', name: 'Save Notes', route: '/notes', icon: 'fa-book', color: '#4CAF50' },
    { id: 'tasks', name: 'Tasks / To-Do list', route: '/tasks', icon: 'fa-pen', color: '#FF9800' },
    { id: 'images', name: 'Image Editor', route: '/images', icon: 'fa-image', color: '#2196F3' },
    { id: 'games', name: 'Games', route: '/games', icon: 'fa-gamepad', color: '#F44336' },
    { id: 'messages', name: 'Hide Messages', route: '/message', icon: 'fa-envelope', color: '#904caf' },
  ]
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userState?.loggedIn) {
        props.setLoader({ showLoader: true, msg: "Getting data..." });
        const data = await fetchUserState();
        props.setLoader({ showLoader: false});
        if (data.error && data.sessionexpired) {
          props.showAlert(data.error, 'danger', 10304);
          return;
        } else if (!data?.loggedIn) {
          props.showAlert('Login Please', 'info', 10284);
          history.navigate('/login');
          return;
        }
      }
  
      try {
        await Promise.all([
          fetchPermissions(),
          fetchHistory(),
        ]);
        getSecretKey();
      } catch (error) {
        props.showAlert('Error fetching data', 'danger', 10005);
      }
    };
    fetchData();
  }, [userState]);


  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        credentials: 'include',
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

  const fetchPermissions = async () => {
    try {
      props.setLoader({ showLoader: true, msg: "Setting up things for you..." });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      const json = await response.json();
      if(json.error) {
        handleSessionExpiry(json);
      }
      if(json.status === 1) {
        const filteredFeatures = Features.filter((feature) => json.user.permissions.includes(feature.id));
        setPermissions(filteredFeatures);
      }
    } catch (error) {
      console.error('Error fetching Permissions:', error);
    } finally {
      props.setLoader({ showLoader: false });
    }
  }

  const deleteHistory = async () => {
    try {
      props.setLoader({ showLoader: true, msg: 'Deleting history...' });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        method: 'DELETE',
        credentials: 'include',
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
        { permissions.length == 0 ? (
            <div className='p-4 m-0 border rounded text-center'>
              <p className='m-0'>You dont have access to any of the features, please contact admin <Link to="/">inotebook002@gmail.com</Link></p>
            </div>
          ) :
          permissions.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ backgroundColor: feature.color }}
              onClick={() => history.navigate(feature.route)}
            >
              <i className={`fa ${feature.icon} feature-icon`}></i>
              <h5 className="feature-name">{feature.name}</h5>
            </div>
          ))
        }
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
