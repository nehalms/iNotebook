import React, { Suspense, useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { history } from '../History';
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
                body: JSON.stringify({name: credentials.name, email: credentials.email, password: credentials.password}), // body data type must match "Content-Type" header
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
      <div className='container my-3'>
        <div className='row'>
          <div className="col-md-2"></div>
          <div className='col-lg-3 p-0'>
              <div className="card my-3" style={{backgroundColor: '#ffc107', height: window.innerWidth > 992 ? height : 'auto'}}>
                  <div className="card-body d-flex flex-column align-items-center justify-content-center">
                      <h2 className='m-0 p-1 text-center'>iNotebook</h2>
                      <h6 className='m-0 p-1 text-center'>Welcome! Sign up now to explore </h6>
                  </div>
              </div>
          </div>
          <div className='col-lg p-0'>
              <div className="card my-3 p-2 border rounded-start" style={{borderTopLeftRadius: '0px'}} ref={divRef}>
                  <div className="card-body">
                      <form onSubmit={handleSubmit}>
                      <h2 className='mb-3 p-3 text-center border rounded bg-secondary-subtle'>Sign Up</h2>
                      <div className="mb-3">
                          <label htmlFor="name" className="form-label">Name</label>
                          <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" minLength={5} required/>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" ref={mail} className="form-control" id="email" name="email" onChange={onChange} required disabled={show || Verified}/>
                          { !show && !Verified && <button type="button" onClick={sendEmail} className="btn btn-warning mt-2">Send code <i className="fa-solid fa-paper-plane mx-2"></i></button> }
                        </div>
                        { Verified && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Verified</div>}
                        {show && 
                          <Suspense fallback={<div>Loading verification...</div>}>
                            <Verification verify={verify} sendEmail={sendEmail} showGif={showGif}/>
                          </Suspense>}
                        <div className="mb-3 my-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <input type={showPassword ? "text" : "password"} ref={pass} className="form-control" id="password" name="password" onChange={onChange} minLength={6} required/>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                          <div className='d-flex align-items-center justify-content-center'>
                            <input type={showPassword ? "text" : "password"} ref={cpass} className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={6} required/>
                            <i onClick={handleShowPassword} className={showPassword ? "fa-solid p-2 mx-2 border rounded fa-eye" : "fa-solid p-2 mx-2 border rounded fa-eye-slash"}></i>
                          </div>
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" style={{width: '100%'}}>Sign up<i className="fa-solid fa-user-plus mx-2"></i></button>
                      </form>
                  </div>
              </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    )
}

export default Signup
