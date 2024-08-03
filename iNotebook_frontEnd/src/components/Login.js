import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = (props) => {
    let navigate = useNavigate();
    const[credentials, setCredentials] = useState({email: "", password: ""});

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
            if(json.success){
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
                                <Link className='mx-0 my-0' to="/login/forgot" role='button'>Forgot password?</Link><br/>
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
