import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Verification from './Verification';

const Signup = (props) => {
    const mail = useRef(null);
    const pass = useRef(null);
    const cpass = useRef(null);
    let navigate = useNavigate();
    const[credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword: ""});
    const[code_, setCode] = useState(0);
    const[show, setShow] = useState(false);
    const[Verified, setVerified] = useState(false);

    const handleSubmit = async (e)=> {
        try {
            if(credentials.password !== credentials.cpassword) {
              props.showAlert("Password didn't match",'warning');
              e.preventDefault();
              return;
            }
            console.log(Verified);
            if(!Verified) {
              props.showAlert("Email not verified", 'danger');
              mail.current.style.border = '2px solid red';  
              e.preventDefault();
              return;
            }
            e.preventDefault();
            props.setLoader({ showLoader: true, msg: "Signing in please wait"});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/createuser`, {
                method: "POST", 
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password}), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            // console.log(json); 
            if(json.success){
              localStorage.setItem('token', json.authToken);
              navigate("/login"); // to redirect the page to home page
              props.showAlert("Sign in successfull", "success");
            }
            else {
                props.showAlert(json.error, "danger");
            }
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
        }
    }

    const onChange = async (e)=> {
        console.log(localStorage.getItem('token'));
        setCredentials({...credentials, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
        // console.log(pass.current.value + " = " + cpass.current.value + " => " + (pass.current.value == cpass.current.value));
        if(cpass.current.value === pass.current.value && credentials.cpassword !== ""){
          cpass.current.style.border = "2px solid green";
        }
        else if(cpass.current.value !== "" && cpass.current.value !== pass.current.value){
          cpass.current.style.border = "2px solid red";
        }
    }

    const sendEmail = (e) => {
      
      if(credentials.email.toString().endsWith(".com")){
        setVerified(false);
        props.showAlert("Code send to your mail", "success");
        setShow(true);
        e.preventDefault();
        var val = Math.floor((Math.random()*1000000)+1);
        setCode(val);
        
        emailjs.send('service_91ihvdw', 'template_uh8dkxp',{
          to_name: credentials.name,
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
        props.showAlert("Email cannot be empty", 'danger');
      }
    };

    const verify = (code)=> {
    //   console.log(code + " " + code_);
      if(code == code_){
        setVerified(true);
        setShow(false);
        mail.current.style.border = '3px solid #63E6BE';
        props.showAlert("Verified", "success");
      }
      else {
        props.showAlert("Invalid code", "danger")
      }
    }

    return (
      <div className='container my-3'>
          <form onSubmit={handleSubmit}>
            <div className="container-fluid vh-50 d-flex align-items-center">
                <div className="row w-100">
                    <h2 className='my-3 text-center'>Create an account to use iNotebook</h2>
                    <div className="col-md-3 d-none d-md-block bg-image"></div>
                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                        <div className="card p-5 w-100">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" minLength={5} required/>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" ref={mail} className="form-control" id="email" name="email" onChange={onChange} required/>
                            { !show && !Verified && <button type="button" onClick={sendEmail} className="btn btn-warning mt-2">Send code</button> }
                          </div>
                          { Verified && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Verified</div>}
                          {show && <Verification verify={verify} sendEmail={sendEmail}/>}
                          <div className="mb-3 my-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" ref={pass} className="form-control" id="password" name="password" onChange={onChange} minLength={6} required/>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                            <input type="password" ref={cpass} className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={6} required/>
                          </div>
                          <button type="submit" className="btn btn-primary mt-3">Submit</button>
                        </div>
                    </div>
                    <div className="col-md-3 d-none d-md-block bg-image"></div>
                </div>
            </div>
            
            
            
            
          </form>
      </div>
    )
}

export default Signup
