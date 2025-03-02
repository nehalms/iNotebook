import React, {useContext, useEffect, useState} from 'react'
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { history } from '../History';
import moment from 'moment';
import loading from './loading.gif' 
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth_state/authContext';

export default function Analytics(props) {
  Chart.register(...registerables);
  history.navigate = useNavigate();
  const { userState } = useContext(AuthContext)
  const [notesData, setNotesData] = useState({xAxisDates: [], notesData: [], colors: []});
  const [loginData, setLoginData] = useState({xAxisDates: [], loginData: [], colors: []});
  const [showUserLoader, setShowUserLoader] = useState(false);
  const [showNoteLoader, setShowNoteLoader] = useState(false);
  const [userDates, setUserDates] = useState({
    startDate: moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
  });
  const [notesDates, setNotesDates] = useState({
    startDate: moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
  })

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async (reqType='both') => {
    try {
      if(!(userState.loggedIn) || !(userState.isAdminUser)) {
        return;
      }
      let dates;
      if(reqType === 'both') {
        dates = {
            startDate: moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD'),
            endDate: moment(new Date()).format('YYYY-MM-DD'),
        }
      }
      else if(reqType === 'user') {
        dates = {...userDates};
      }
      else if(reqType === 'notes') {
        dates = {...notesDates};
      }
      if(
        dates.endDate > moment(new Date()).format('YYYY-MM-DD') || 
        dates.startDate > dates.endDate || 
        ((moment(new Date(dates.endDate)).diff(moment(new Date(dates.startDate))))/(60*60*24*1000)) >= 20
      ) {
        if(dates.endDate > moment(new Date()).format('YYYY-MM-DD')) {
            props.showAlert('End date cannot be in future', 'info', 10005);
        } else if (dates.startDate > dates.endDate) {
            props.showAlert('Start date cannot be greater than End date', 'info', 10006);
        } else {
            props.showAlert('Difference between the dates should be less than 20 days', 'info', 10007);
        }
        return;
      }
      reqType === 'both' 
        ? props.setLoader({ showLoader: true, msg: "Loading..."}) 
        : reqType === 'user' 
            ? setShowUserLoader(true) 
            : setShowNoteLoader(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/graphData?reqType=${reqType}&startDate=${dates.startDate}&endDate=${dates.endDate}`, {
          method: "GET", 
          headers: {
            "Content-Type": "application/json", 
          },
          credentials: 'include'
      });
      const data = await response.json();
      if(data.error) {
        props.showAlert(data.error, 'danger', 10034);
        return;
      }
      props.setLoader({ showLoader: false});
      setShowUserLoader(false);
      setShowNoteLoader(false);
      if(reqType === 'both' || reqType === 'user') {
        setLoginData({
            xAxisDates: data.xAxisDates,
            loginData: data.loginData,
            colors: data.colors,
        });
      }
      if(reqType === 'both' || reqType === 'notes') {
        setNotesData({
            xAxisDates: data.xAxisDates,
            notesData: data.notesData,
            colors: data.colors,
        });
      }
    } catch (err) {
        props.setLoader({ showLoader: false });
        console.log('Error**', err);
        props.showAlert("Some Error occured", 'danger', 10035);
    }
  }

  return (
    <div className="row align-items-center justify-content-center">
      <div className='col-md-6'>
          <div className="card shadow-lg my-3 py-2">
              <div className="card-body">
                <h4 className='text-center'>No. of Login's ({loginData.loginData.length} days)</h4>
                <div className='d-flex align-items-center justify-content-end'>
                    <div>
                        <p className='m-0'>From</p>
                        <input className='rounded p-1' type="date" name="fromDateUser" value={userDates.startDate} onChange={(e) => {setUserDates({startDate: e.target.value, endDate: userDates.endDate})} }/>
                    </div>
                    <div className='mx-2'>
                        <p className='m-0'>To</p>
                        <input className='rounded p-1' type="date" name="toDateUser" value={userDates.endDate} onChange={(e) => {setUserDates({startDate: userDates.startDate, endDate: e.target.value})}}/>
                    </div>
                    <div>
                        <p className='m-0' style={{visibility: 'hidden'}}>Hide</p>
                        <div className='p-2 rounded' style={{backgroundColor: '#f5a52c', cursor: 'pointer'}} onClick={() => {fetchData('user')}}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                </div>
                <h6>Total count : {loginData.loginData.length > 1 ? loginData.loginData.reduce((val, sum) => {return sum + val}) : loginData.loginData}</h6>
                <div style={{ maxWidth: "650px", maxHeight: '600px'}}>
                    {!showUserLoader && <Bar
                        data={{
                            labels: loginData.xAxisDates,
                            datasets: [
                                {
                                    label: `total count/value`,
                                    data: loginData.loginData,
                                    backgroundColor: loginData.colors,
                                    borderColor: loginData.colors,
                                    borderWidth: 0.5,
                                },
                            ],
                        }}
                        height={400}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                    },
                                ],
                            },
                            legend: {
                                labels: {
                                    fontSize: 15,
                                },
                            },
                        }}
                    />}
                    {showUserLoader && <div className="text-center">
                        <img src={loading} alt="loading" />
                    </div>}
                </div>
              </div>
          </div>
      </div>
      <div className='col-md-6'>
          <div className="card shadow-lg my-3 py-2">
              <div className="card-body">
                <h4 className='text-center'>No. Notes of created ({notesData.notesData.length} days)</h4>
                <div className='d-flex align-items-center justify-content-end'>
                    <div>
                        <p className='m-0'>From</p>
                        <input className='rounded p-1' type="date" name="fromDateNote" value={notesDates.startDate} onChange={(e) => {setNotesDates({startDate: e.target.value, endDate: notesDates.endDate})} }/>
                    </div>
                    <div className='mx-2'>
                        <p className='m-0'>To</p>
                        <input className='rounded p-1' type="date" name="toDateNote" value={notesDates.endDate} onChange={(e) => {setNotesDates({startDate: notesDates.startDate, endDate: e.target.value})}}/>
                    </div>
                    <div>
                        <p className='m-0' style={{visibility: 'hidden'}}>Hide</p>
                        <div className='p-2 rounded' style={{backgroundColor: '#f5a52c', cursor: 'pointer'}} onClick={() => {fetchData('notes')}}>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                    </div>
                </div>
                <h6>Total count : {notesData.notesData.length > 1 ? notesData.notesData.reduce((val, sum) => {return sum + val}) : notesData.notesData}</h6>
                <div style={{ maxWidth: "650px" }}>
                    {!showNoteLoader && <Bar
                        data={{
                            labels: notesData.xAxisDates,
                            datasets: [
                                {
                                    label: `total count/value`,
                                    data: notesData.notesData,
                                    backgroundColor: notesData.colors,
                                    borderColor: notesData.colors,
                                    borderWidth: 0.5,
                                },
                            ],
                        }}
                        height={400}
                        options={{
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                        },
                                    },
                                ],
                            },
                            legend: {
                                labels: {
                                    fontSize: 15,
                                },
                            },
                        }}
                    />}
                    {showNoteLoader && <div className="text-center">
                        <img src={loading} alt="loading" />
                    </div>}
                </div>
              </div>
          </div>
      </div>
      {/* <div className='col-md-6'>
          <div className="card my-3 py-2" style={{backgroundColor: '#89faba', height: '400px'}}>
              <div className="card-body">
                <h5 className="card-title my-0 text-center">No. of Notes : </h5>
              </div>
          </div>
      </div>
      <div className='col-md-6'>
          <div className="card my-3 py-2" style={{backgroundColor: '#89faba', height: '400px'}}>
              <div className="card-body">
                <h5 className="card-title my-0 text-center">No. of Notes : </h5>
              </div>
          </div>
      </div> */}
    </div>
  )
}
