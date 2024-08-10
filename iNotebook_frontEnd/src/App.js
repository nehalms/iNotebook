//'use npm run both' command to run both front end backend server at a time
import './App.css';
import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar'
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import Forgot from './components/Forgot_';
import Spinner from './components/Spinner';
import DashBoard from './components/DashBoard';
import Confirmation from './components/Confirmation';

function App() {
  const [alert, setAlert] = useState(null);
  const [mode, setMode] = useState('light');
  const [loader, setLoader] = useState({ showLoader: false, msg: ""});
  const [dialogInfo, setDialogInfo] = useState({open: false});

  const showAlert = (message, type, id=null)=> {
    setAlert({
      msg: message,
      type: type,
      id: Math.random(1000, 2000)
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
  }, []);

  const removeBodyClasses = ()=> {
    document.body.classList.remove('bg-light');
    document.body.classList.remove('bg-dark');
    document.body.classList.remove('bg-warning');
    document.body.classList.remove('bg-danger');
    document.body.classList.remove('bg-primary');
    document.body.classList.remove('bg-success');
  }

  const toggleMode = (cls)=> {
    removeBodyClasses();
    if(cls !== null) {
      document.body.classList.add('bg-' + cls);
      showAlert("Background color changed", 'info');
      localStorage.setItem('theme', `bg-${cls}`);
    }
    if(mode === 'light' && cls === null) {
      setMode('dark');
      document.body.style.backgroundColor = '#042743';
      document.body.style.color = 'white';
      showAlert("Dark Mode has been Enabled", 'info');
      localStorage.setItem('theme', 'bg-dark');
    }
    else if('dark' && cls === null){
      setMode('light');
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
      showAlert("Light Mode has been Enabled", 'info');
      localStorage.setItem('theme', 'bg-light');
    }
  }

  const setUserInactive = async () => {
    try {
      setLoader({ showLoader: true, msg: "Please wait"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/changestatus`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
          }
      });
      setLoader({ showLoader: false });
      localStorage.removeItem('token');
    } catch (err) {
      console.log("Error**" ,err);
      showAlert("Some Error Occured", 'danger')
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
    showAlert(`${dialogInfo.title} Success`, 'success');
    setUserInactive();
    // window.location.reload();
  }

  const onClose = () => {
    setDialogInfo({open: false});
    return;
  }

  return (
    <>
      <NoteState showAlert={showAlert}  setLoader={setLoader}>  {/* components inside this can access the context data */}
        <Router>
          <Navbar showAlert={showAlert} mode={mode} toggleMode={toggleMode} setLoader={setLoader} setDialog={setDialog} />
          <Alert alert={alert} setLoader={setLoader} />
          {loader.showLoader && <Spinner msg={loader.msg}/>}
          {dialogInfo.open && <Confirmation open={dialogInfo.open} title={dialogInfo.title} onClose={onClose} onConfirm={onConfirm} />}
          <div className="container">
            <Routes>
              <Route exact path='/' element={<Home showAlert={showAlert}  setLoader={setLoader}/>} /> 
              <Route exact path='/about' element={<About showAlert={showAlert} setLoader={setLoader}/>} />    
              <Route exact path='/login' element={<Login showAlert={showAlert} setLoader={setLoader}/>}/>       
              <Route exact path='/login/forgot' element={<Forgot showAlert={showAlert} setLoader={setLoader}/>}/>   
              <Route exact path='/signup' element={<Signup showAlert={showAlert} setLoader={setLoader}/>}/>   
              <Route exact path='/dashboard' element={<DashBoard showAlert={showAlert} setLoader={setLoader}/>}/>   
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>

  );
}

export default App;
