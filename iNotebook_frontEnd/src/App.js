//'use npm run both' command to run both front end backend server at a time
import './App.css';
import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar'
import About from './components/About';
import NoteState from './context/notes/NoteState';
import Alert from './components/Alert';
import Login from './components/Login';
import Signup from './components/Signup';
import Forgot from './components/Forgot_';


function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type)=> {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
        setAlert(null);
    }, 2500);
  }
  return (
    <>
     
      <NoteState>  {/* components inside this can access the context data */}
        <Router>
          <Navbar showAlert={showAlert}/>
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
              <Route exact path='/' element={<Home showAlert={showAlert} />} /> 
              <Route exact path='/about' element={<About showAlert={showAlert}/>} />    
              <Route exact path='/login' element={<Login showAlert={showAlert}/>}/>       
              <Route exact path='/login/forgot' element={<Forgot showAlert={showAlert}/>}/>   
              <Route exact path='/signup' element={<Signup showAlert={showAlert}/>}/>   
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>

  );
}

export default App;
