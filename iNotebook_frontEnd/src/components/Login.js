import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = (props) => {
    let navigate = useNavigate();
    const[credentials, setCredentials] = useState({email: "", password: ""});

    const handleSubmit = async (e)=> {
        e.preventDefault(); // to prevent page from reloading
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
            method: "POST", 
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({email: credentials.email, password: credentials.password}), // body data type must match "Content-Type" header
        });
        const json = await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token', json.authToken);
            navigate("/"); // to redirect the page to home page
            props.showAlert("Logged in successfully", "success");
        }
        else {
            props.showAlert(json.error, "danger");
        }
    }

    const onChange = (e)=> {
        setCredentials({...credentials, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
    }

    return (
        <div className='container my-5'>
            <form onSubmit={handleSubmit}>
                <h2 className='my-3'>Login to continue on iNotebook</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} value={credentials.email} id="email" name="email" aria-describedby="emailHelp"/>
                </div>
                <div className="mb-0">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} value={credentials.password} id="password" name="password"/>
                </div>
                <Link className='mx-0' to="/login/forgot" role='button'>Forgot password?</Link><br/>
                <button type="submit" className="btn btn-primary my-3">Login</button>
            </form>
        </div>
    )
}

export default Login
