import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { history } from '../History';
import { encryptMessage } from '../Utils/Encryption';
const Verification = React.lazy(() => import('../Utils/Verification'));

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [checkForAdminUser, setCheckForAdminUser] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [showGif, setShowGif] = useState(false);
    const [Verified, setVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const divRef = useRef();
    const [height, setHeight] = useState(0);
    history.navigate = useNavigate();

    useEffect(() => {
        if (!divRef.current) return;
        const resizeObserver = new ResizeObserver(() => {
            setHeight(divRef.current.clientHeight);
        });
        resizeObserver.observe(divRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            props.setLoader({ showLoader: true, msg: 'Logging in, please wait...' });
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login?verified=${Verified}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: encryptMessage(credentials.email),
                    password: encryptMessage(credentials.password)
                }),
            });
            props.setLoader({ showLoader: false });
            const json = await response.json();

            if (json.success) {
                if (json.isAdminUser && checkForAdminUser) {
                    setCheckForAdminUser(false);
                    setIsAdminUser(true);
                    sendEmail();
                    return;
                }
                if (isAdminUser && !Verified) {
                    props.showAlert('Admin passkey not verified', 'danger');
                    return;
                }
                if(isAdminUser) {
                    sessionStorage.setItem('adminToken', json.authToken);
                } else {
                    localStorage.setItem('token', json.authToken);
                }
                history.navigate(isAdminUser ? '/dashboard' : '/');
                props.showAlert(`Logged in successfully ${isAdminUser ? ' as Admin' : ''}`,'success');
            } else {
                props.showAlert(json.errors ? json.errors[0].msg : json.error, 'danger');
            }
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.error(err);
            props.showAlert('An error occurred during login', 'danger');
        }
    };

    const sendEmail = async () => {
        if (!credentials.email) {
            props.showAlert('Email cannot be empty', 'danger');
            return;
        }
        setVerified(false);
        try {
            props.setLoader({ showLoader: true, msg: 'Sending OTP...' });
            await fetch(`${process.env.REACT_APP_BASE_URL}/mail/send?toAdmin=true`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    email: credentials.email,
                    cc: [],
                    subject: 'Admin Login',
                    text: '',
                }),
            });
            props.setLoader({ showLoader: false });
            props.showAlert('Code sent to your email', 'success');
        } catch (err) {
            props.setLoader({ showLoader: false });
            console.error(err);
            props.showAlert('Failed to send OTP', 'danger');
        }
    };

    const verify = async (code) => {
        try {
            setShowGif(true);
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/mail/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    email: credentials.email,
                    code,
                },
            });
            const res = await response.json();
            setVerified(res.success && res.verified);
            props.showAlert(res.msg, res.success && res.verified ? 'success' : 'danger');
        } catch (err) {
            console.error(err);
            props.showAlert('Verification failed', 'danger');
        } finally {
            setShowGif(false);
        }
    };

    const onChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });
    const handleShowPassword = () => setShowPassword(!showPassword);

    return (
        <div className="container d-flex align-items-center justify-content-center vh-80 my-2">
            <div className="card shadow-lg" style={{ width: '35rem', borderRadius: '1rem' }}>
                <div
                    className="card-header text-center text-white fw-bold py-4"
                    style={{ backgroundColor: '#198754', borderRadius: '1rem 1rem 0 0' }}
                >
                    <h2>iNotebook</h2>
                    <p className='m-0'>Save your notes from one place, access anywhere</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <h4 className="text-center mb-4">Welcome Back!</h4>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                onChange={onChange}
                                value={credentials.email}
                                disabled={isAdminUser}
                                required
                            />
                        </div>
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <div className="mb-3 position-relative input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                id="password"
                                name="password"
                                onChange={onChange}
                                value={credentials.password}
                                disabled={isAdminUser}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleShowPassword}
                            >
                                <i className={`fa-solid ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                            </button>
                        </div>
                        { Verified && <div><i className="mx-2 fa-solid fa-check" style={{color: "#63E6BE"}}></i>Admin passkey verified !!!</div>}
                        { !isAdminUser && 
                            <div className="text-end mt-3 me-1">
                                <Link to="/forgot" className="text-decoration-none">
                                    Forgot password?
                                </Link>
                            </div>
                        }
                        {isAdminUser && !Verified && (
                            <Suspense fallback={<div>Loading verification...</div>}>
                                <Verification verify={verify} sendEmail={sendEmail} msg="Enter Admin Passkey" showGif={showGif}/>
                            </Suspense>
                        )}
                        <button type="submit" className="btn btn-primary w-100 mt-4">
                            Login <i className="fa-solid fa-right-to-bracket ms-2"></i>
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
