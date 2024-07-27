import React, {useEffect, useState} from 'react'
import { Link, useLocation } from "react-router-dom";



const Navbar = (props) => {
    const [userinfo, setUserinfo] = useState({name: "", email: "", })
    let location = useLocation(); //helps to get the exact location i,e the path where exactly the we are(url)
    useEffect(() => {       
        console.log(location.pathname)
      }, [location]);
    
    const getUser = async ()=> {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getuser`, {
            method: "POST", 
            headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setUserinfo({name: json.name, email: json.email});
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">iNotebook</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/' ? 'active' : ""}`} aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                        <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ""}`} to="/about">About</Link>
                        </li>
                    </ul>
                    {location.pathname !== '/'  ?
                        <form className="d-flex" role="search">
                            <Link className='btn btn-success mx-1' to="/login" role='button'>Login</Link>
                            <Link className='btn btn-warning mx-3' to="/signup" role='button'>Signup</Link>
                        </form> : 
                        <>
                        <div class="dropdown">
                            <button class="btn btn-success " type="button" onClick={() => {return getUser()}} data-bs-toggle="dropdown" aria-expanded="false">Profile</button>
                            <ul class="dropdown-menu">
                                <li><div class="text-bg-light p-3 rounded">{userinfo.name}</div></li>
                                <li><div class="text-bg-light p-3 rounded">{userinfo.email}</div></li>
                            </ul>
                        </div>
                        <Link className='btn btn-info mx-3' to="/login" role='button' onClick={() => {props.showAlert("logged out", "success"); localStorage.removeItem('token')}}>Logout</Link>
                        </>
                    }
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
