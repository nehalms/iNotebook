//'use npm run both' command to run both front end backend server at a time
import './App.css';
import React, { Suspense, useContext, useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { history } from '../src/components/History';
import Navbar from './components/Navbar'
import NoteState from './context/notes/NoteState';
import Alert from './components/Utils/Alert';
import Spinner from './components/LoadingScreens/Spinner';
import ComponentLoader from './components/LoadingScreens/ComponentLoader';
import Confirmation from './components/Utils/Confirmation';
import TaskState from './context/tasks/TaskState';
import Folder from './components/ToDoLists/Folders/Folder';
import AuthContext from './context/auth_state/authContext';
import Breadcrumbs from './components/Utils/Breadcrumb';

const Home = React.lazy(() => import('./components/Home'));
const Login = React.lazy(() => import('./components/Auth/Login'));
const Signup = React.lazy(() => import('./components/Auth/Signup'));
const Forgot = React.lazy(() => import('./components/Auth/Forgot_'));
const DashBoard = React.lazy(() => import('./components/Admin/DashBoard'));
const Notes = React.lazy(() => import('./components/Notes/Notes'));
const ImageEditor = React.lazy(() => import('./components/Images/ImageEditor'));
const Menu = React.lazy(() => import('./components/Games/Menu'));
const Tic_tac_toe = React.lazy(() => import('./components/Games/Tic_tac_toe'));
const Encrypt_Decrypt_Msg = React.lazy(() => import('./components/Messages/Encrypt_Decrypt_Msg'));
const FrInRow = React.lazy(() => import('./components/Games/FrInRow'));
const Profile = React.lazy(() => import('./components/Profile/Profile'));
const News = React.lazy(() => import('./components/News/News'));
const WorkCalendar = React.lazy(() => import('./components/WorkCalendar/Calendar'))
function App() {
  const [alert, setAlert] = useState(null);
  const [mode, setMode] = useState('light');
  const [loader, setLoader] = useState({ showLoader: false, msg: ""});
  const [dialogInfo, setDialogInfo] = useState({open: false});
  const { resetUserState } = useContext(AuthContext);

  const showAlert = (message, type, id)=> {
    setAlert({
      msg: message,
      type: type,
      id: id,
    });
    setTimeout(() => {
        setAlert(null);
    }, 2500);
  }

  useEffect(() => {
    removeBodyClasses();
    if (localStorage.getItem('theme')) {
      let theme = localStorage.getItem('theme').split('bg-')[1]
      if (theme === 'dark') {
        setMode('dark');
        document.body.style.backgroundColor = '#042743';
        document.body.style.color = 'white';
        document.body.classList.add(theme);
      } else if (localStorage.getItem('theme') === 'light') {
        setMode('light');
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        document.body.classList.add(theme);
      } else if (localStorage.getItem('theme').startsWith('bg-')){
        document.body.classList.add(localStorage.getItem('theme'));
      }
    }
    getEncryptKey();
  }, []);

  const getEncryptKey = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getpubKey`);
      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem('publicKey', data.key);
      }
    } catch (error) {
      console.error('Error fetching key:', error);
    }
  };

  const removeBodyClasses = ()=> {
    document.body.classList.remove('bg-light');
    document.body.classList.remove('bg-dark');
    document.body.classList.remove('bg-warning');
    document.body.classList.remove('bg-danger');
    document.body.classList.remove('bg-primary');
    document.body.classList.remove('bg-success');
    document.body.classList.remove('bg-info');
    document.body.classList.remove('bg-primary-subtle');
    document.body.classList.remove('bg-secondary-subtle');
    document.body.classList.remove('bg-info-subtle');
  }

  const toggleMode = (cls)=> {
    removeBodyClasses();
    if(cls !== null) {
      document.body.classList.add('bg-' + cls);
      localStorage.setItem('theme', `bg-${cls}`);
    }
    if(mode === 'light' && cls === null) {
      setMode('dark');
      document.body.style.backgroundColor = '#042743';
      document.body.style.color = 'white';
      localStorage.setItem('theme', 'bg-dark');
    }
    else if('dark' && cls === null){
      setMode('light');
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      localStorage.setItem('theme', 'bg-light');
    }
  }

  const setUserInactive = async () => {
    try {
      setLoader({ showLoader: true, msg: "Please wait"});
      await fetch(`${process.env.REACT_APP_BASE_URL}/auth/changestatus`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
      });
      resetUserState();
      setLoader({ showLoader: false });
    } catch (err) {
      console.log("Error**" ,err);
      showAlert("Error in deleting user", 'danger', 10203)
    }
  }

  const setDialog = (open_, path_, title_) => {
    setDialogInfo({
      open: open_,
      path: path_,
      title: title_,
    });
  }

  const onConfirm = () => {
    setDialogInfo({open: false});
    showAlert(`Account deleted Successfully`, 'success', 10202);
    setUserInactive();
    history.navigate('/login');
  }

  const onClose = () => {
    setDialogInfo({open: false});
    return;
  }

  return (
    <>
      <NoteState showAlert={showAlert}  setLoader={setLoader}>  {/* components inside this can access the context data */}
        <TaskState showAlert={showAlert}  setLoader={setLoader}>
          <Router>
            <Navbar showAlert={showAlert} mode={mode} toggleMode={toggleMode} setLoader={setLoader} setDialog={setDialog} />
            <Alert alert={alert} setLoader={setLoader} />
            <SpeedInsights/>
            {loader.showLoader && <Spinner msg={loader.msg}/>}
            {dialogInfo.open && <Confirmation open={dialogInfo.open} title={dialogInfo.title} onClose={onClose} onConfirm={onConfirm} />}
            <div className="container" style={{marginTop: '70px'}}>
              <Breadcrumbs/>
              <Suspense fallback={<div><ComponentLoader msg={'Loading...'}/></div>}>
                <Routes>
                  <Route exact path='/' element={<Home showAlert={showAlert}  setLoader={setLoader}/>} /> 
                  <Route exact path='/login' element={<Login showAlert={showAlert} setLoader={setLoader}/>}/>       
                  <Route exact path='/forgot' element={<Forgot showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/signup' element={<Signup showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/dashboard' element={<DashBoard showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/profile' element={<Profile showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/notes' element={<Notes showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/tasks' element={<Folder showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/images' element={<ImageEditor showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/games' element={<Menu showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/games/tictactoe' element={<Tic_tac_toe showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/games/frinrow' element={<FrInRow showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/message' element={<Encrypt_Decrypt_Msg showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/news' element={<News showAlert={showAlert} setLoader={setLoader}/>}/>   
                  <Route exact path='/calendar' element={<WorkCalendar showAlert={showAlert} setLoader={setLoader}/>}/>   
                </Routes>
              </Suspense>
            </div>
          </Router>
        </TaskState>
      </NoteState>
    </>

  );
}

export default App;
