import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import UserNotesData from './UserNotesData';
import Analytics_tab from './Analytics';
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';
import GameStats from './GameStats';
import Confirmation from '../Utils/Confirmation';

export default function DashBoard(props) {
    
    history.navigate = useNavigate();
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        onConfirm: () => {},
        onClose: () => {},
    });

    useEffect(()=> {
        if(!sessionStorage.getItem('adminToken')) {
            props.showAlert("User not Authorized to access dashboard", 'info', 10036);
            history.navigate('/login');
            return;
        }
        if(sessionStorage.getItem('adminToken') && jwtDecode(sessionStorage.getItem('adminToken')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10037);
            history.navigate("/login");
            return;
        }
    }, []);

    const setDialogFunc = (open, title, onConfirm, onClose) => {
        setDialog({
            open: open, 
            title: title,
            onConfirm: onConfirm,
            onClose: onClose,
        });
    }

  return (
    <>
        {dialog.open && <Confirmation open={dialog.open} title={dialog.title} onConfirm={dialog.onConfirm} onClose={dialog.onClose} />}
        <h2 className='text-center'><i className="fa-solid fa-gauge mx-3 mb-3"></i>Information Dashboard</h2>
        <Tabs 
            defaultactivekey="users"
            id="controlled-tabs"
            className="mb-4"
            selectedTabClassName="rounded-top bg-info-subtle text-dark border border-dark" 
            // onSelect={(selectedKey) => {props.showAlert(`Showing ${tabKeyMaps[selectedKey]} Data`, 'info')}}
            >
            <TabList>
                <Tab title="Users" style={{width: '200px'}}>
                    <div className="m-0 text-center my-3 rounded">Users <i className="fa-solid fa-users mx-2"></i></div>
                </Tab>
                <Tab title="Game Stats"  style={{width: '200px'}}>
                    <div className="m-0 text-center my-3 rounded">Game Stats <i className="fa-solid fa-chart-simple mx-2"></i></div>
                </Tab>
                <Tab title="Analytics"  style={{width: '200px'}}>
                    <div className="m-0 text-center my-3 rounded">Analytics <i className="fa-solid fa-chart-line mx-2"></i></div>
                </Tab>
            </TabList>
            <TabPanel>
                <UserNotesData showAlert={props.showAlert} setLoader={props.setLoader} setDialog={setDialogFunc} />
            </TabPanel>
            <TabPanel>
                <GameStats showAlert={props.showAlert} setLoader={props.setLoader} setDialog={setDialogFunc} />
            </TabPanel>
            <TabPanel>
                <Analytics_tab showAlert={props.showAlert} setLoader={props.setLoader} setDialog={setDialogFunc} />
            </TabPanel>
        </Tabs>
    </>
  )
}
