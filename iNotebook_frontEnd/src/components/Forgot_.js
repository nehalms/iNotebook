import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Verification from './Verification';
import emailjs from '@emailjs/browser';
import { history } from '../History';

const Forgot_ = (props)=> {
  let navigate = useNavigate();
  const mail = useRef(null);
  const pass = useRef(null);
  const cpass = useRef(null);
  const [show, setShow] = useState(false);
  const [code_, setCode] = useState(0);
  const[Verified, setVerified] = useState(false);
  const[id, setid] = useState("");
  const[credentials, setCredentials] = useState({email: "", password: "", cpassword: ""});

  
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
      // console.log(json);
      if(credentials.email.toString().endsWith("gmail.com") && json.found){
        setid(json.user._id);
        setVerified(false);
        props.showAlert("Code send to your mail", "success");
        setShow(true);
        e.preventDefault();
        var val = Math.floor((Math.random()*1000000)+1);
        setCode(val);
        
        emailjs.send('service_91ihvdw', 'template_uh8dkxp',{
          to_name: credentials.email.replace('@gmail.com', ''),
          message: "Verification code ",
          code : val,
          to_mail: credentials.email,
        } , 'ytEYvYv1q0VNEV4EE', 
        )
        .then((result) => {
              console.log(result.text);
          }, (error) => {
              console.log(error.text);
          });
      }
      else{
        if(!credentials.email.toString().endsWith("@gmail.com")){
          props.showAlert("Enter valid email", 'warning');
          return
        }
        props.showAlert("Email not found", 'danger');
      }
    } catch (err) {
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  };

  const verify = (code)=> {
    console.log(code + " " + code_);
    if(code == code_){
      setVerified(true);
      setShow(false);
      mail.current.style.border = '3px solid #63E6BE';
      props.showAlert("Verified", "success");
    }
    else {
      props.showAlert("Invalid code", "danger")
    }
  };

  return (
    <div className='container my-3'>
      <form onSubmit={handleSubmit}>
        <div className="container-fluid vh-50 d-flex align-items-center">
            <div className="row w-100">
                <h2 className='my-3 text-center'>Reset Password</h2>
                <div className="col-md-3 d-none d-md-block bg-image"></div>
                <div className="col-md-6 d-flex align-items-center justify-content-center">
                    <div className="card p-5 w-100">
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" ref={mail} className="form-control" id="email" name="email" onChange={onChange} required/>
                          { !show && !Verified && <button type="button" onClick={sendEmail} className="btn btn-warning mt-2">Send code <i className="fa-solid fa-paper-plane mx-2"></i></button> }
                        </div>
                        { Verified  && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Verified</div>}
                        { show && <Verification verify={verify} sendEmail={sendEmail}/>}
                        { Verified && <div className="mb-3 my-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input type="password" ref={pass} className="form-control" id="password" name="password" onChange={onChange} minLength={6} required/>
                        </div>}
                        { Verified && <div className="mb-3">
                          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                          <input type="password" ref={cpass} className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={6} required/>
                        </div>}
                        { Verified && <button type="submit" className="btn btn-primary mt-4">Update</button>}
                    </div>
                </div>
                <div className="col-md-3 d-none d-md-block bg-image"></div>
            </div>
        </div>
        
        
      </form>
    </div>
  )
}

export default Forgot_
