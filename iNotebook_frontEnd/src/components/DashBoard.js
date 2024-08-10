import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import UserNotesData from './UserNotesData';
import Analytics_tab from './Analytics';
import { jwtDecode } from 'jwt-decode';

export default function DashBoard(props) {
    let navigate = useNavigate();

    let tabKeyMaps = {
        0 : 'Users',
        1 : 'Analytics',
    }

    useEffect(()=> {
        if(!sessionStorage.getItem('adminToken')) {
            props.showAlert("Only admin can access the dashboard", 'info');
            navigate('/login');
            return;
        }
        if(jwtDecode(sessionStorage.getItem('adminToken')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger');
            navigate("/login");
            return;
        }
    }, []);

  return (
    <>
        <h2 className='text-center'>Information Dashboard</h2>
        <Tabs 
            defaultactivekey="users"
            id="controlled-tabs"
            className="mb-4"
            selectedTabClassName="rounded-top bg-info-subtle text-dark border border-dark" 
            onSelect={(selectedKey) => {props.showAlert(`Showing ${tabKeyMaps[selectedKey]} Data`, 'info')}}
            >
            <TabList>
                <Tab eventKey="users" title="Users" style={{width: '200px'}}>
                    <div className="m-0 text-center my-3 rounded">Users</div>
                </Tab>
                <Tab eventKey="analytics" title="Analytics"  style={{width: '200px'}}>
                    <div className="m-0 text-center my-3 rounded">Analytics</div>
                </Tab>
            </TabList>
            <TabPanel>
                <UserNotesData showAlert={props.showAlert} setLoader={props.setLoader}/>
            </TabPanel>
            <TabPanel>
                <Analytics_tab showAlert={props.showAlert} setLoader={props.setLoader}/>
            </TabPanel>
        </Tabs>
    </>
  )
}
