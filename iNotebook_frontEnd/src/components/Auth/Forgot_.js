import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Verification from '../Utils/Verification';
import { history } from '../History';
import { getForgotPasshtml } from './getEmailHtml';

const Forgot_ = (props)=> {
  history.navigate = useNavigate();
  const mail = useRef(null);
  const pass = useRef(null);
  const cpass = useRef(null);
  const [show, setShow] = useState(false);
  const divRef = useRef();
  const [height, setHeight] = useState(0);
  const [code_, setCode] = useState(0);
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
      props.setLoader({ showLoader: true, msg: "Updating password"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/updatePassword`, {
        method: "POST", 
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({id: id, email: credentials.email, password: credentials.password}), // body data type must match "Content-Type" header
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
      props.setLoader({ showLoader: true, msg: "Checking if user exists"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getPassword`, {
        method: "POST", 
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({email: credentials.email}), // body data type must match "Content-Type" header
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if(credentials.email.toString().endsWith(".com") && json.found){
        var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        try {
          let html = getForgotPasshtml(val); 
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
              html: html
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
        setCode(val);
      } 
      else{
        if(!credentials.email.toString().endsWith(".com")){
          props.showAlert("Enter valid email", 'warning');
          return
        }
        props.showAlert("Email not found", 'danger');
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  };

  const verify = (code)=> {
    // console.log(code + " " + code_);
    if(code === code_){
      setVerified(true);
      setShow(false);
      mail.current.style.border = '3px solid #63E6BE';
      props.showAlert("Verified", "success");
    }
    else {
      props.showAlert("Invalid code", "danger")
    }
  };

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  return (
    <div className='container my-3'>
      <div className='row'>
        <div className="col-md-2"></div>
        <div className='col-lg-3 p-0'>
            <div className="card my-3 bg-primary" style={{height: window.innerWidth > 992 ? height : 'auto'}}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <h2 className='m-0 p-1 text-center text-white'>iNotebook</h2>
                    <h6 className='m-0 p-1 text-center text-white'>Please note that we cannot recover your original password because we store it using hashing and salting techniques</h6>
                </div>
            </div>
        </div>
        <div className='col-lg p-0'>
            <div className="card my-3 p-2 border rounded-start" style={{borderTopLeftRadius: '0px'}} ref={divRef}>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <h2 className='mb-3 p-3 text-center border rounded bg-secondary-subtle'>Reset Password</h2>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" ref={mail} className="form-control" id="email" name="email" onChange={onChange} required disabled={show || Verified}/>
                          { !show && !Verified && <button type="button" onClick={sendEmail} className="btn btn-warning mt-2">Send code <i className="fa-solid fa-paper-plane mx-2"></i></button> }
                        </div>
                        { Verified  && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Verified</div>}
                        { show && <Verification verify={verify} sendEmail={sendEmail}/>}
                        { Verified && <div className="mb-3 my-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input type={showPassword ? "text" : "password"} ref={pass} className="form-control" id="password" name="password" onChange={onChange} minLength={6} required/>
                        </div>}
                        { Verified && <div className="mb-3">
                          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                          <div className='d-flex align-items-center justify-content-center'>
                            <input type={showPassword ? "text" : "password"} ref={cpass} className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={6} required/>
                            <i onClick={handleShowPassword} className={showPassword ? "fa-solid p-2 mx-2 border rounded fa-eye" : "fa-solid p-2 mx-2 border rounded fa-eye-slash"}></i>
                          </div>
                        </div>}
                        { Verified && <button type="submit" className="btn btn-primary mt-4" style={{width: '100%'}}>Update</button>}
                    </form>
                </div>
            </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  )
}

export default Forgot_
