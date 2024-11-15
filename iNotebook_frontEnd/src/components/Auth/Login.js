import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Verification from '../Utils/Verification';
import { history } from '../History';
import { getAdminhtml } from './getEmailHtml';

const Login = (props) => {
    const[credentials, setCredentials] = useState({email: "", password: ""});
    let [checkForAdminUser, setCheckForAdminUser] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const[code, setCode] = useState();
    const divRef = useRef();
    const [height, setHeight] = useState(0);
    const[Verified, setVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    history.navigate = useNavigate();

    useEffect(() => {
        if( !divRef.current ) return;
        const resizeObserver = new ResizeObserver(() => {
            setHeight(divRef.current.clientHeight);
        });
        resizeObserver.observe(divRef.current);
        return () => resizeObserver.disconnect();
    }, [])

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
            if (json.success && json.isAdminUser && json.isAdminUser === true && checkForAdminUser) {
                setCheckForAdminUser(false);
                sessionStorage.setItem('adminToken', json.authToken);
                localStorage.setItem('token', json.authToken);
                var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                setCode(val);
                setIsAdminUser(true);
                sendEmail();
                e.preventDefault();
                return;
            }
            if(isAdminUser) {
                if(!Verified) {
                    props.showAlert("Admin passkey not verified", 'danger');
                    e.preventDefault();
                    return;
                } else if(Verified) {
                    history.navigate('/dashboard');
                    props.showAlert("Logged in as Admin", 'success');
                }
            }
            else if(json.success){
                sessionStorage.removeItem('adminToken');
                localStorage.setItem('token', json.authToken);
                history.navigate("/"); // to redirect the page to home page
                props.showAlert("Logged in successfully", "success");
            }
            else {
                props.showAlert(json.errors ? json.errors[0].msg : json.error, "danger");
            }
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log('Error** ', err);
            props.showAlert("Some Error Occured", "danger");
        }
    }

    const sendEmail = async () => {
        if(credentials.email.toString().endsWith(".com")){
          setVerified(false);
          var val = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
          setCode(val);
          try {
            let html = getAdminhtml(val); 
            let email = [];
            props.setLoader({ showLoader: true, msg: "Sending otp..."});
            await fetch(`${process.env.REACT_APP_BASE_URL}/mail/send?toAdmin=true`, {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email,
                cc: [],
                subject: 'Admin Login',
                text: '',
                html: html
              }),
            });
            props.setLoader({ showLoader: false });
            props.showAlert("Code send to your mail", "success");
          } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**");
          }    
        }
        else{
          props.showAlert("Email cannot be empty", 'danger');
        }
      };

    const verify = (verCode)=> {
        if(code === verCode){
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

    const handleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    }

    return (
        <div className='container my-3'>
            <div className='row'>
                <div className="col-md-2"></div>
                <div className='col-lg-3 p-0'>
                    <div className="card my-3" style={{backgroundColor: '#198754', height: window.innerWidth > 992 ? height : 'auto'}}>
                        <div className="card-body d-flex flex-column align-items-center justify-content-center">
                            <h2 className='m-0 p-1 text-center text-white'>iNotebook</h2>
                            <h6 className='m-0 p-1 text-center text-white'>Save from one place, access from anywhere</h6>
                        </div>
                    </div>
                </div>
                <div className='col-lg p-0'>
                    <div className="card my-3 p-2 border rounded-start" style={{borderTopLeftRadius: '0px'}} ref={divRef}>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <h2 className='mb-3 p-3 text-center border rounded bg-secondary-subtle'>Login</h2>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control" onChange={onChange} value={credentials.email} required id="email" name="email" aria-describedby="emailHelp" disabled={isAdminUser}/>
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input type={showPassword ? "text" : "password"} className="form-control" onChange={onChange} value={credentials.password} id="password" name="password" required disabled={isAdminUser}/>
                                        <i onClick={handleShowPassword} className={showPassword ? "fa-solid p-2 mx-2 border rounded fa-eye" : "fa-solid p-2 mx-2 border rounded fa-eye-slash"}></i>
                                    </div>
                                </div>
                                { !isAdminUser && <div className='text-end'><Link className='mx-0 my-0 link-underline-opacity-75-hover link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0' to="/forgot" role='button'>Forgot password?</Link><br/></div>}
                                { isAdminUser && !Verified && <Verification verify={verify} sendEmail={sendEmail} msg="Enter the Admin passkey"/> }
                                { Verified && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Admin passkey Verified</div>}
                                <button type="submit" className="btn btn-primary mt-3 mb-4" style={{width: '100%'}}>Login <i className="fa-solid fa-right-to-bracket mx-2"></i></button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-2"></div>
            </div>
        </div>
    )
}

export default Login
