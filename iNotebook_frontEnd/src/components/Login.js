import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import emailjs from '@emailjs/browser';
import Verification from './Verification';

const Login = (props) => {
    let navigate = useNavigate();
    const[credentials, setCredentials] = useState({email: "", password: ""});
    let [checkForAdminUser, setCheckForAdminUser] = useState(true);
    let [authEmail, setAuthEmail] = useState("");
    const [isAdminUser, setIsAdminUser] = useState(false);
    const[code, setCode] = useState();
    const[Verified, setVerified] = useState(false);

    const handleSubmit = async (e)=> {
        e.preventDefault(); // to prevent page from reloading
        try {
            props.setLoader({ showLoader: true, msg: "Logging in please wait"});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin" : "http://localhost:3000"
                },
                body: JSON.stringify({email: credentials.email, password: credentials.password}), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            // console.log(json);
            if (json.success && checkForAdminUser) {
                setCheckForAdminUser(false);
                props.setLoader({ showLoader: true, msg: "Please wait"});
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getuser`, {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": json.authToken,
                    }
                });
                props.setLoader({ showLoader: false });
                const adminData = await response.json();
                if(adminData && adminData.isAdmin) {
                    setAuthEmail(adminData.authEmail);
                    sessionStorage.setItem('adminToken', json.authToken);
                    var val = Math.floor((Math.random()*1000000)+1);
                    setCode(val);
                    setIsAdminUser(true);
                    sendEmail(e, adminData.authEmail);
                    e.preventDefault();
                    return;
                }
            }
            if(isAdminUser) {
                if(!Verified) {
                    props.showAlert("Admin passkey not verified", 'danger');
                    e.preventDefault();
                    return;
                } else if(Verified) {
                    navigate('/dashboard');
                    props.showAlert("Logged in as Admin", 'success');
                }
            }
            else if(json.success){
                sessionStorage.removeItem('adminToken');
                localStorage.setItem('token', json.authToken);
                navigate("/"); // to redirect the page to home page
                props.showAlert("Logged in successfully", "success");
            }
            else {
                props.showAlert(json.error, "danger");
            }
        } catch (err) {
            console.log('Error** ', err);
            props.showAlert("Some Error Occured", "danger");
        }
    }

    const sendEmail = (e, email = null) => {
        if(credentials.email.toString().endsWith(".com")){
          setVerified(false);
          props.showAlert("Code send to your mail", "success");
          var val = Math.floor((Math.random()*1000000)+1);
          setCode(val);
          let json = {
            to_name: "Nehal",
            message: "Verification code ",
            code : val,
            to_mail: email ? email : authEmail
          }
          console.log(json);

          emailjs.send('service_91ihvdw', 'template_uh8dkxp',{
            to_name: "Nehal",
            message: "Verification code ",
            code : val,
            to_mail: email ? email : authEmail,
          } , 'ytEYvYv1q0VNEV4EE', 
          )
          .then((result) => {
                console.log(result.text);
            }, (error) => {
                props.showAlert(error.text, 'danger');
                console.log(error.text);
            });
        }
        else{
          props.showAlert("Email cannot be empty", 'danger');
        }
      };

    const verify = (verCode)=> {
        if(code == verCode){
          setVerified(true);
          props.showAlert("Verified", "success");
        }
        else {
          props.showAlert("Invalid code", "danger")
        }
      };

    const onChange = (e)=> {
        setCredentials({...credentials, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
    }

    return (
        <div className='container my-3'>
            <form onSubmit={handleSubmit}>
                <div className="container-fluid vh-50 d-flex align-items-center">
                    <div className="row w-100">
                        <h2 className='my-3 text-center'>Login to continue on iNotebook</h2>
                        <div className="col-md-3 d-none d-md-block bg-image"></div>
                        <div className="col-md-6 d-flex align-items-center justify-content-center">
                            <div className="card p-5 w-100">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control" onChange={onChange} value={credentials.email} required id="email" name="email" aria-describedby="emailHelp"/>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" onChange={onChange} value={credentials.password} id="password" name="password" required/>
                                </div>
                                { !isAdminUser && <><Link className='mx-0 my-0' to="/login/forgot" role='button'>Forgot password?</Link><br/></>}
                                { isAdminUser && !Verified && <Verification verify={verify} sendEmail={sendEmail} msg="Enter the Admin passkey"/> }
                                { Verified && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Admin passkey Verified</div>}
                                <button type="submit" className="btn btn-primary mt-3">Login</button>
                            </div>
                        </div>
                        <div className="col-md-3 d-none d-md-block bg-image"></div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
