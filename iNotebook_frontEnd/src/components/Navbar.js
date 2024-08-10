import React, {useEffect, useState} from 'react'
import { Link, useLocation } from "react-router-dom";

const Navbar = (props) => {
    const [userinfo, setUserinfo] = useState({name: "", email: "", })
    let location = useLocation(); //helps to get the exact location i,e the path where exactly the we are(url)
    useEffect(() => {       
        console.log(location.pathname)
      }, [location]);
    
    const getUser = async ()=> {
        try {
            props.setLoader({ showLoader: true, msg: "Please wait"});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getuser`, {
                method: "POST", 
                headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
                }
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();
            setUserinfo({name: json.name, email: json.email});
        } catch (err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger');
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-black">
                <div className="container-fluid ">
                    <Link className="navbar-brand text-white" to="/">iNotebook</Link>
                    <button className="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* <li className="nav-item">
                            {location.pathname === '/' ? <Link className={`nav-link ${location.pathname === '/' ? 'active' : ""} text-white`} aria-current="page" to="/">Home</Link> : <></>}
                        </li> */}
                    </ul>
                    <div className="d-flex mx-5">
                        <div className="bg-primary rounded mx-2" onClick={() => {props.toggleMode('primary')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-warning rounded mx-2" onClick={() => {props.toggleMode('warning')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-success rounded mx-2" onClick={() => {props.toggleMode('success')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-danger rounded mx-2" onClick={() => {props.toggleMode('danger')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                    </div>

                    <div className={`form-check form-switch mx-5 text-${props.mode === 'light' ? 'dark' : 'light'}`}>
                        { props.mode == 'light' ? 
                            <input className="form-check-input" type="checkbox" role="switch" onClick={() => {props.toggleMode(null)}} id="flexSwitchCheckDefault"/> : 
                            <input className="form-check-input" type="checkbox" role="switch" onClick={() => {props.toggleMode(null)}} id="flexSwitchCheckDefault" checked/>
                        }
                        <label className="form-check-label text-white" htmlFor="flexSwitchCheckDefault">Dark Mode</label>
                    </div>
                    { (localStorage.getItem('token') || sessionStorage.getItem('adminToken')) && ((location.pathname === '/' || location.pathname === '/dashboard')) ?
                        <>
                        { localStorage.getItem('token') && !sessionStorage.getItem('adminToken') && 
                            <div className="dropdown">
                                <button className="btn btn-success mx-1 my-2" type="button" onClick={() => {return getUser()}} data-bs-toggle="dropdown" aria-expanded="false">Profile</button>
                                <ul className="dropdown-menu">
                                    <li><div className="text-bg-light p-3 rounded">{userinfo.name}</div></li>
                                    <li><div className="text-bg-light p-3 rounded">{userinfo.email}</div></li>
                                </ul>
                            </div>
                        }
                        <Link className='btn btn-warning mx-3' to="/login" role='button' onClick={() => {props.showAlert("logged out", "success"); localStorage.removeItem('token'); sessionStorage.removeItem('adminToken'); }}>Logout</Link>
                        {localStorage.getItem('token') && !sessionStorage.getItem('adminToken') && <Link className='btn btn-danger mx-1' onClick={() => {props.setDialog(true, '/login', 'Delete Account') }} role='button'>Delete Account</Link>}
                        </> :
                        <form className="d-flex" role="search">
                            <Link className='btn btn-success mx-1' to="/login" role='button'>Login</Link>
                            <Link className='btn btn-warning mx-3' to="/signup" role='button'>Signup</Link>
                        </form>
                    }
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
