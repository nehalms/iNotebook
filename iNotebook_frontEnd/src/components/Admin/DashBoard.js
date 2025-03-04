import React, { useContext, useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import UserNotesData from './UserNotesData';
import Analytics_tab from './Analytics';
import Permissions from './Permissions';
import { history } from '../History';
import GameStats from './GameStats';
import Confirmation from '../Utils/Confirmation';
import AuthContext from '../../context/auth_state/authContext';

export default function DashBoard(props) {
    const { userState, fetchUserState } = useContext(AuthContext);
    const [dialog, setDialog] = useState({
        open: false,
        title: '',
        color: 'danger',
        onConfirm: () => {},
        onClose: () => {},
    });

    useEffect(()=> {
        const fetchData = async () => {
            let state = await fetchUserState();
            if(!(state && state.loggedIn)) {
                props.showAlert('Please log in', 'warning', 10002);
                history.navigate('/login');
                return;
            }
            if(!(state && state.loggedIn && state.isAdminUser)) {
                props.showAlert("User not Authorized to access dashboard", 'info', 10036);
                history.navigate('/');
                return;
            }
        };
        fetchData();
    }, []);

    const setDialogFunc = (open, title, onConfirm, onClose, color='danger') => {
        setDialog({
            open: open, 
            title: title,
            onConfirm: onConfirm,
            onClose: onClose,
            color: color,
        });
    }

  return (
    <>
        {dialog.open && <Confirmation open={dialog.open} title={dialog.title} color={dialog.color} onConfirm={dialog.onConfirm} onClose={dialog.onClose} />}
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
                <Tab title="Permissions"  style={{width: '200px'}}>
                    <div className="m-0 text-center my-3 rounded">Permissions <i className="fa-solid fa-flag-checkered mx-2"></i></div>
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
                <Permissions showAlert={props.showAlert} setLoader={props.setLoader} setDialog={setDialogFunc} />
            </TabPanel>
            <TabPanel>
                <Analytics_tab showAlert={props.showAlert} setLoader={props.setLoader} setDialog={setDialogFunc} />
            </TabPanel>
        </Tabs>
    </>
  )
}
