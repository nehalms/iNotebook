import React, { useEffect, useState } from 'react'
import loadingGif from '../loading.gif' 
import './LiveUsersData.css'

function LiveUsersData(props) {
  const [liveUsersData, setLiveUsersData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveUsers();
  }, []);

  const fetchLiveUsers = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/heartbeat/live/users`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if(data.error) {
        props.showAlert(data.error, 'danger', 10034);
        return;
      }
      if (data.status === 1) {
        setLiveUsersData(data.liveUsers);
      }
    } catch(err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const boxStyle = {
    cursor: 'pointer',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    MsUserSelect: 'none',
  };

  const loadingScreen = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(252, 252, 252, 0.7)',
    borderRadius: '5px',
    zIndex: 99,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div style={{position: 'relative'}}>
      {
        isLoading &&
        <div className='m-0 p-0' style={loadingScreen}>
          <img src={loadingGif} alt="loading" />
        </div>
      }
      <div className='mb-2 d-flex align-items-center justify-content-between'>
        <h4 className='text-center p-0 m-0'><i className="mx-2 fa-solid fa-circle" style={{ color: '#63E6BE' }}></i>Users Online ({liveUsersData.length})</h4>
        <div className='p-2' onClick={fetchLiveUsers} style={boxStyle}>
          <i className="fa-solid fa-arrows-rotate"></i> Refresh
        </div>
      </div>
      <div className={`${liveUsersData.length === 0 ? 'd-flex justify-content-center align-items-center' : 'lu-table-container'}`}>
        {
          liveUsersData.length === 0 ? 
          <h5 className='m-2 py-2'>Looks like it’s quiet here – no users online</h5> :
          <table className="lu-table">
            <thead className="lu-thead">
              <tr>
                <th className="lu-th">User Id</th>
                <th className="lu-th">User Name</th>
                <th className="lu-th">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {liveUsersData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? 'lu-row-even' : 'lu-row-odd'}>
                  <td className="lu-td">{row.id}</td>
                  <td className="lu-td">{row.name}</td>
                  <td className="lu-td">{row.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  )
}

export default LiveUsersData
