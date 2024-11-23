import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Verification from '../Utils/Verification';
import { history } from '../History';
import { encryptMessage } from '../Utils/Encryption';

const Forgot_ = (props)=> {
  history.navigate = useNavigate();
  const mail = useRef(null);
  const pass = useRef(null);
  const cpass = useRef(null);
  const [show, setShow] = useState(false);
  const divRef = useRef();
  const [height, setHeight] = useState(0);
  const [showGif, setShowGif] = useState(false);
  const[Verified, setVerified] = useState(false);
  const[id, setid] = useState("");
  const[credentials, setCredentials] = useState({email: "", password: "", cpassword: ""});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if(!divRef.current) return; 
    const resizeObserver = new ResizeObserver(() => {
        setHeight(divRef.current.clientHeight);
    });
    resizeObserver.observe(divRef.current);
    return () => resizeObserver.disconnect();
  }, [])
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if(credentials.password !== credentials.cpassword) {
        props.showAlert("Password does not match", 'warning');
        return;
      }
      if(!Verified) {
        props.showAlert("Please verify the email", 'info');
        return;
      }
      props.setLoader({ showLoader: true, msg: "Updating password"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/updatePassword`, {
        method: "POST", 
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: encryptMessage(id), 
          email: encryptMessage(credentials.email), 
          password: encryptMessage(credentials.password)
        }), // body data type must match "Content-Type" header
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      // console.log(json);
      if(json.success){
        props.showAlert("Password updated successfully", 'success');
      }
      else{
        props.showAlert("Something went wrong", 'danger');
      }
      history.navigate('/login');
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  }

  const onChange = async (e)=> {
    setCredentials({...credentials, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
    if(Verified){
      if(cpass.current.value === pass.current.value && credentials.cpassword !== ""){
        cpass.current.style.border = "2px solid green";
      }
      else if(cpass.current.value !== "" && cpass.current.value !== pass.current.value){
        cpass.current.style.border = "2px solid red";
      }
    }
  }

  const sendEmail = async (e) => {    
    try {
      if(!credentials.email.toString().endsWith(".com")){
        props.showAlert("Enter valid email", 'warning');
        return
      }
      props.setLoader({ showLoader: true, msg: "Checking if user exists"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getPassword`, {
        method: "POST", 
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: encryptMessage(credentials.email)
        }), // body data type must match "Content-Type" header
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if(credentials.email.toString().endsWith(".com") && json.found){
        try {
          let email = [];
          email.push(credentials.email);
          props.setLoader({ showLoader: true, msg: "Sending email"});
          let response = await fetch(`${process.env.REACT_APP_BASE_URL}/mail/send`, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              cc: [],
              subject: 'Reset Password',
              text: '',
            }),
          });
          const res = await response.json();
          props.setLoader({ showLoader: false });
          if(!res.success) {
            props.showAlert("Mail error: cannot send email", 'danger');
            return;
          }
          props.showAlert("Code send to your mail", "success");    
        } catch (err) {
          props.setLoader({ showLoader: false });
          console.log("Error**", err);
          props.showAlert("Mail error: cannot send email", 'danger');
        }
        setid(json.user._id);
        setVerified(false);
        setShow(true);
        e.preventDefault();
      } 
      else{
        props.showAlert("Email not found", 'danger');
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  };

  const verify = async (code)=> {
    try {
      setShowGif(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/mail/verify`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "email": credentials.email,
          "code": code,
        },
      });
      const res = await response.json();
      if(res.success === true) {
        if(res.verified === true) {
          setVerified(true);
          setShow(false);
          mail.current.style.border = '3px solid #63E6BE';
          props.showAlert(res.msg, "success");
        } else {
          props.showAlert(res.msg, "danger")
        }
      }
    } catch (err) {
      console.log("Error**", err);
      props.showAlert("Mail error: cannot verify code", 'danger');
    } finally {
      setShowGif(false);
    }
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (
    <div className='container d-flex align-items-center justify-content-center vh-80 my-2'>
        <div className="card shadow-lg" style={{ width: '35rem', borderRadius: '1rem' }}>
          <div
              className="card-header text-center text-white fw-bold py-4"
              style={{ backgroundColor: '#0d6efd', borderRadius: '1rem 1rem 0 0' }}
          >
            <h2>iNotebook</h2>
            <h6 className='m-0'>Please note that we cannot recover your original password because we store it using hashing and salting techniques</h6>
          </div>
          <div className="card-body">
              <form onSubmit={handleSubmit}>
                  <h2 className='text-center mb-4'>Reset Password</h2>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" ref={mail} className="form-control" id="email" name="email" onChange={onChange} required disabled={show || Verified}/>
                    { !show && !Verified && <button type="button" onClick={sendEmail} className="btn btn-warning mt-2">Send code <i className="fa-solid fa-paper-plane mx-2"></i></button> }
                  </div>
                  { Verified  && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Verified</div>}
                  { show && <Verification verify={verify} sendEmail={sendEmail} showGif={showGif}/>}
                  { Verified && <div className="mb-3 my-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type={showPassword ? "text" : "password"} ref={pass} className="form-control" id="password" name="password" onChange={onChange} minLength={6} required/>
                  </div>}
                  { Verified && <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        ref={cpass}
                        className="form-control"
                        id="cpassword"
                        name="cpassword"
                        value={credentials.cpassword}
                        onChange={onChange}
                        minLength={6}
                        required
                      />
                      <button type="button" className="btn btn-outline-secondary" onClick={handleShowPassword}>
                        <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                      </button>
                    </div>
                  </div>}
                  { Verified && <button type="submit" className="btn btn-primary mt-4" style={{width: '100%'}}>Update<i className="fa-solid fa-pen-to-square mx-2"></i></button>}
              </form>
          </div>
        </div>
    </div>
  )
}

export default Forgot_
