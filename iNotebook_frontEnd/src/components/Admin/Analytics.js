import React, {useEffect, useState} from 'react'
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';
import moment from 'moment';
import loading from './loading.gif' 

export default function Analytics(props) {
  Chart.register(...registerables);

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
    if(jwtDecode(sessionStorage.getItem('adminToken')).exp < Date.now() / 1000) {
      props.showAlert("Session expired Login again", 'danger');
      history.navigate("/login");
      return;
    }
    if(sessionStorage.getItem('adminToken'))
      fetchData();
  }, [])

  const fetchData = async (reqType='both') => {
    try {
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
      console.log("differesce",(moment(new Date(dates.endDate)).diff(moment(new Date(dates.startDate))))/(60*60*24*1000));
      if(
        dates.endDate > moment(new Date()).format('YYYY-MM-DD') || 
        dates.startDate > dates.endDate || 
        ((moment(new Date(dates.endDate)).diff(moment(new Date(dates.startDate))))/(60*60*24*1000)) > 20
      ) {
        if(dates.endDate > moment(new Date()).format('YYYY-MM-DD')) {
            props.showAlert('End date cannot be in future', 'info');
        } else if (dates.startDate > dates.endDate) {
            props.showAlert('Start date cannot be greater than End date', 'info');
        } else {
            props.showAlert('Difference between the dates should be less than 20 days', 'info');
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
              "auth-token": sessionStorage.getItem('adminToken')
          }
      });
      const data = await response.json();
      if(data.error) {
        props.showAlert(data.error, 'danger');
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
        props.showAlert("Some Error occured", 'danger');
    }
  }

  return (
    <div className="row align-items-center justify-content-center">
      <div className='col-md-6'>
          <div className="card shadow-lg my-3 py-2">
              <div className="card-body">
                <h4 className='text-center'>No. of Login's (Past 7 days)</h4>
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
                <h4 className='text-center'>No. Notes of created (Past 7 days)</h4>
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