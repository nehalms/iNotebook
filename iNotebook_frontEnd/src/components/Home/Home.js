import React, { Suspense, useEffect, useState } from 'react';
import { history } from '../History';
import './Home.css';
import loading_gif from './loading.gif';
import Confirmation from '../Utils/Confirmation';
import { fetchSecretKeyFromServer } from '../Requests/getSecretKey'
import { Link, useNavigate } from 'react-router-dom';
import useSession from '../SessionState/useSession';
import { useDispatch } from 'react-redux';
import { setSecretKey } from '../SessionState/sessionSlice';
import { v4 as uuidv4 } from 'uuid';

const UserHistoryTable = React.lazy(() => import('../Tables/UserHistorytable'));

const Home = (props) => {
  history.navigate = useNavigate();
  const dispatch = useDispatch();
  const [userHistory, setHistory] = useState();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, permissions_, secretKey, isAdmin } = useSession();
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    onConfirm: () => {},
    onClose: () => {},
  });
  const Features = [
    { id: 'notes', name: 'Save Notes', route: '/notes', icon: 'fa-book', color: '#4CAF50' },
    { id: 'tasks', name: 'Tasks / To-Do list', route: '/tasks', icon: 'fa-pen', color: '#2196F3' },
    { id: 'images', name: 'Image Editor', route: '/images', icon: 'fa-image', color: '#FF9800' },
    { id: 'games', name: 'Games', route: '/games', icon: 'fa-gamepad', color: '#904caf' },
    { id: 'messages', name: 'Hide Messages', route: '/message', icon: 'fa-envelope', color: '#F44336' },
    { id: 'news', name: 'Top News', route: '/news', icon: 'fa-newspaper', color: '#af4c7d' },
    { id: 'calendar', name: 'Work Calendar', route: '/calendar', icon: 'fa-calendar', color: '#4cafa8' },
  ]
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      // props.showAlert('Login Please', 'info', 10284);
      history.navigate('/login');
      return;
    } else {
      const fetch = async () => {
        !secretKey && dispatch(setSecretKey(await fetchSecretKeyFromServer()));
      }
      fetch();
      !sessionStorage.getItem('deviceId') && !isAdmin && sendHeartBeat();
      fetchPermissions();
      fetchHistory();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;
    const heartBeat = setInterval(async () => {
      sendHeartBeat(heartBeat);
    }, 25000);

    return () => {
      clearInterval(heartBeat);
    }
  }, [isLoggedIn]);

  const getOrCreateDeviceId = () => {
    let id = sessionStorage.getItem('deviceId');
    if (!id) {
      id = uuidv4();
      sessionStorage.setItem('deviceId', id);
    }
    return id;
  }

  const sendHeartBeat = async (heartBeat=null) => {
    const id = getOrCreateDeviceId();
    try {
      let respones = await fetch(`${process.env.REACT_APP_BASE_URL}/heartbeat/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await respones.json();
      if (data.status == 0) {
        clearInterval(heartBeat);
        return;
      }
    } catch (error) {
      console.error('Error in heartbeat:', error);
    }
  }


  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getdata/userhistory`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.error) {
        props.showAlert(data.error, 'danger', 36959);
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
      if(permissions_.length) {
        const filteredFeatures = Features.filter((feature) => permissions_.includes(feature.id));
        setPermissions(filteredFeatures);
        return;
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
