import React, {useEffect, useState} from 'react'
import { BarChart } from '@mui/x-charts/BarChart'
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function Analytics(props) {
  Chart.register(...registerables);

  let navigate = useNavigate();
  const [graphData, setGraphData] = useState({xAxisDates: [], notesData: [], loginData: [], colors: []});

  useEffect(() => {
    if(jwtDecode(sessionStorage.getItem('adminToken')).exp < Date.now() / 1000) {
      props.showAlert("Session expired Login again", 'danger');
      navigate("/login");
      return;
    }
    if(sessionStorage.getItem('adminToken'))
      fetchData();
  }, [])

  const fetchData = async () => {
    try {
      props.setLoader({ showLoader: true, msg: "Loading..."});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getData/graphData`, {
          method: "GET", 
          headers: {
              "Content-Type": "application/json",
              "auth-token": sessionStorage.getItem('adminToken')
          }
      });
      props.setLoader({ showLoader: false });
      const data = await response.json();
      console.log(data);
      setGraphData({
        xAxisDates: data.xAxisDates,
        loginData: data.loginData,
        notesData: data.notesData,
        colors: data.colors,
      });
    } catch (err) {
      console.log('Error**', err);
      props.showAlert("Some Error occured", 'danger');
    }
  }

  return (
    <div className="row align-items-center justify-content-center">
      <div className='col-md-6'>
          <div className="card my-3 py-2">
              <div className="card-body">
                <h4 className='text-center'>No. of Login's (Past 7 days)</h4>
                <h6>Total count : {graphData.loginData.length > 1 ? graphData.loginData.reduce((val, sum) => {return sum + val}) : graphData.loginData}</h6>
                <div style={{ maxWidth: "650px" }}>
                    <Bar
                        data={{
                            labels: graphData.xAxisDates,
                            datasets: [
                                {
                                    label: `total count/value`,
                                    data: graphData.loginData,
                                    backgroundColor: graphData.colors,
                                    borderColor: graphData.colors,
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
                    />
                </div>
              </div>
          </div>
      </div>
      <div className='col-md-6'>
          <div className="card my-3 py-2">
              <div className="card-body">
                <h4 className='text-center'>No. Notes of created (Past 7 days)</h4>
                <h6>Total count : {graphData.notesData.length > 1 ? graphData.notesData.reduce((val, sum) => {return sum + val}) : graphData.notesData}</h6>
                <div style={{ maxWidth: "650px" }}>
                    <Bar
                        data={{
                            labels: graphData.xAxisDates,
                            datasets: [
                                {
                                    label: `total count/value`,
                                    data: graphData.notesData,
                                    backgroundColor: graphData.colors,
                                    borderColor: graphData.colors,
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
                                      // The y-axis value will start from zero
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
                    />
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
