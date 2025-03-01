import React, {useContext, useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { history } from './History';
import img from './favicon-32x32.png'
import './Navbar.css'
import AuthContext from '../context/auth_state/authContext';

const Navbar = (props) => {
    history.navigate = useNavigate();
    const { userState, resetUserState } = useContext(AuthContext);
    const [showNavBar, setShowNavbar] = useState(false);
    const [modeEnabled, setEnabled] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') === 'bg-dark' : false);

    let location = useLocation(); //helps to get the exact location i,e the path where exactly the we are(url)
    useEffect(() => {       
        console.log(location.pathname);
      }, [location]);
    
    const handleLogout = async () => {
        try {
            props.setLoader({ showLoader: true, msg: "Logging out..."});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });
            const data = await response.json();
            if(data.success === true) {
                props.showAlert(data.msg, "success", 10031); 
                resetUserState();
                sessionStorage.removeItem('AesKey');
                history.navigate('/login');
            }
        } catch (err) {
            props.showAlert("Error in logging out", "danger", 10032); 
            console.log("Error**", err);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const handleShowNavbar = () => {
        setShowNavbar(!showNavBar);
    }

    return (
        <div>
            <nav className="navbar">
                <div className="container__">
                    <div className="logo">
                        <Link className="navbar-brand text-white" to="/"><span><img src={img} alt="image" style={{width: '35px', height: '35px'}}/></span> iNotebook - Home</Link>
                    </div>
                    <div className="mx-5 my-2 outer-bg-colors">
                        <div className="bg-primary rounded my-1 mx-2" onClick={() => {props.toggleMode('primary')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-warning rounded my-1 mx-2" onClick={() => {props.toggleMode('warning')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-success rounded my-1 mx-2" onClick={() => {props.toggleMode('success')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-danger rounded my-1 mx-2" onClick={() => {props.toggleMode('danger')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-info rounded my-1 mx-2" onClick={() => {props.toggleMode('info')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-primary-subtle my-1 rounded mx-2" onClick={() => {props.toggleMode('primary-subtle')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-secondary-subtle my-1 rounded mx-2" onClick={() => {props.toggleMode('secondary-subtle')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                        <div className="bg-info-subtle rounded my-1 mx-2" onClick={() => {props.toggleMode('info-subtle')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                    </div>
                    <div className="menu-icon" onClick={handleShowNavbar}>
                        {
                            showNavBar ? 
                            <i className="fa-solid fa-x fa-2xl cross" style={{color: 'white'}}></i>
                            : <i className="fa-solid fa-bars fa-2xl" style={{color: 'white'}}></i>
                        }
                    </div>
                    <div className={`nav-elements ${showNavBar && 'active'}`}>
                        <ul className='p-0'>
                            <div className="my-2 mx-5 bg-colors">
                                <div className="bg-primary rounded my-1 mx-2" onClick={() => {props.toggleMode('primary')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-warning rounded my-1 mx-2" onClick={() => {props.toggleMode('warning')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-success rounded my-1 mx-2" onClick={() => {props.toggleMode('success')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-danger rounded my-1 mx-2" onClick={() => {props.toggleMode('danger')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-info rounded my-1 mx-2" onClick={() => {props.toggleMode('info')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-primary-subtle my-1 rounded mx-2" onClick={() => {props.toggleMode('primary-subtle')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-secondary-subtle my-1 rounded mx-2" onClick={() => {props.toggleMode('secondary-subtle')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                                <div className="bg-info-subtle rounded my-1 mx-2" onClick={() => {props.toggleMode('info-subtle')}} style={{height:'20px', width:'20px', cursor:'pointer'}} ></div>
                            </div>
                            <li className='mx-2 my-1'>
                                <div className={`mx-2 my-1 mode ${modeEnabled && 'active'}`} onClick={() => {props.toggleMode(null); setEnabled(!modeEnabled);}}>
                                    <div>    
                                        <p className='m-0'>Dark mode</p>
                                        <i className="fa-solid fa-circle-half-stroke mx-2"></i>
                                    </div>
                                </div>
                            </li>
                            { ((userState?.loggedIn) || (userState?.loggedIn && userState?.isAdminUser)) && ((location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgot')) ?
                                <>
                                    <div className='my-2 profile'>
                                        <Link className={`mx-3 my-2 ${location.pathname === '/profile' && 'active'}`} to="/profile" role='button' onClick={() => {setShowNavbar(!showNavBar)}}>Profile<i className="fa-solid fa-user mx-2"></i></Link>
                                    </div>
                                    <Link className={`px-3 my-2 logout`} role='button' onClick={handleLogout}>Logout <i className="fa-solid fa-arrow-right-from-bracket mx-2"></i></Link>
                                    {(userState?.loggedIn) && !(userState?.loggedIn && userState?.isAdminUser) && <Link className='px-3 my-2' onClick={() => {props.setDialog(true, '/login', 'Delete Account') }} role='button'>Delete Account <i className="mx-2 fa-solid fa-trash-can"></i></Link>}
                                    { 
                                        (userState?.loggedIn && userState?.isAdminUser) && 
                                        <div className='my-2 mx-1'>
                                            <Link className={`px-3 my-2 ${location.pathname === '/dashboard' && 'active'}`} to='/dashboard' role='button'>DashBoard<i className="mx-2 fa-solid fa-gauge"></i></Link>
                                        </div>
                                    }
                                </> :
                                <>
                                    <div className='my-2 login'>
                                        <Link className={`mx-3 ${location.pathname === '/login' && 'active'}`} to="/login" role='button' onClick={() => {setShowNavbar(!showNavBar)}}>Login<i className="fa-solid fa-right-to-bracket mx-2"></i></Link>
                                    </div>
                                    <div className='my-2'>
                                        <Link className={`mx-3 ${location.pathname === '/signup' && 'active'}`} to="/signup" role='button' onClick={() => {setShowNavbar(!showNavBar)}}>Signup <i className="fa-solid fa-user-plus mx-2"></i></Link>
                                    </div>
                                </>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
