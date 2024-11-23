import React, { Suspense, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { history } from '../History';
import { getEncryptKey } from '../Requests/getEncryptKey';
import { encryptMessage } from '../Utils/Encryption';
const Verification = React.lazy(() => import('../Utils/Verification'));

const Signup = (props) => {
    const mail = useRef(null);
    const pass = useRef(null);
    const cpass = useRef(null);
    const[credentials, setCredentials] = useState({name:"", email: "", password: "", cpassword: ""});
    const divRef = useRef();
    const [height, setHeight] = useState(0);
    const [showGif, setShowGif] = useState(false);
    const[show, setShow] = useState(false);
    const[Verified, setVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    history.navigate = useNavigate();

    useEffect(() => {
      if( !divRef.current ) return; 
      const resizeObserver = new ResizeObserver(() => {
          setHeight(divRef.current.clientHeight);
      });
      getEncryptKey();
      resizeObserver.observe(divRef.current);
      return () => resizeObserver.disconnect();
    }, [])

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
                body: JSON.stringify({
                  name: encryptMessage(credentials.name), 
                  email: encryptMessage(credentials.email), 
                  password: encryptMessage(credentials.password)
                }), // body data type must match "Content-Type" header
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            // console.log(json); 
            if(json.success){
              history.navigate("/login"); // to redirect the page to home page
              props.showAlert("Sign in successfull", "success");
            }
            else {
                props.showAlert(json.error, "danger");
            }
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
        }
    }

    const onChange = async (e)=> {
        setCredentials({...credentials, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
        // console.log(pass.current.value + " = " + cpass.current.value + " => " + (pass.current.value == cpass.current.value));
        if(cpass.current.value === pass.current.value && credentials.cpassword !== ""){
          cpass.current.style.border = "2px solid green";
        }
        else if(cpass.current.value !== "" && cpass.current.value !== pass.current.value){
          cpass.current.style.border = "2px solid red";
        }
    }

    const sendEmail = async (e) => {
      if( !credentials.email ) {
        props.showAlert("Please enter the email", 'info');
        return;
      }
      if(credentials.email.toString().endsWith(".com")){
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
              subject: 'Create Account',
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
        setVerified(false);
        setShow(true);
        e.preventDefault();
      }
      else{
        props.showAlert("Invalid Email", 'danger');
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
    }

    const handleShowPassword = (e) => {
      e.preventDefault();
      setShowPassword(!showPassword);
    }

    return (
      <div className='container d-flex align-items-center justify-content-center vh-80 my-2'>
         <div className="card shadow-lg" style={{ width: '35rem', borderRadius: '1rem' }}>
            <div
                className="card-header text-center text-black fw-bold py-4"
                style={{ backgroundColor: '#ffc107', borderRadius: '1rem 1rem 0 0' }}
            >
                <h2>iNotebook</h2>
                <p className='m-0'>Welcome! Sign up now to explore</p>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <h4 className="text-center mb-4">Create your account now!</h4>
                  <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        onChange={onChange} 
                        aria-describedby="emailHelp" 
                        minLength={5} 
                        required
                      />
                    </div>
                    <label htmlFor="email" className="form-label">Email</label>
                    <div className="d-flex">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onChange}
                        ref={mail}
                        disabled={show || Verified}
                        required
                      />
                      {!show && !Verified && (
                        <button type="button" onClick={sendEmail} className="btn btn-warning ms-2">
                          Verify
                        </button>
                      )}
                    </div>
                    { Verified && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Verified</div>}
                    {show && 
                      <Suspense fallback={<div>Loading verification...</div>}>
                        <Verification verify={verify} sendEmail={sendEmail} showGif={showGif}/>
                      </Suspense>}
                    <div className="mb-3 my-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input 
                        type={showPassword ? "text" : "password"} 
                        ref={pass} 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        onChange={onChange} 
                        minLength={6} 
                        required
                      />
                    </div>
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
                    <button type="submit" className="btn btn-primary mt-3" style={{width: '100%'}}>Sign up<i className="fa-solid fa-user-plus mx-2"></i></button>
                  </form>
              </div>
          </div>
      </div>
    )
}

export default Signup
