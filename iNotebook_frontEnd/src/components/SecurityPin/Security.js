import React, { useEffect, useRef, useState } from 'react';
import loadingGif from './loading.gif' 
import { encryptMessage } from '../Utils/Encryption';
import { useDispatch } from 'react-redux';
import { setPinVerified } from '../SessionState/sessionSlice';
import useSession from '../SessionState/useSession';

function Security({ toVerify, showAlert }) {
  const dispatch = useDispatch();
  const focusRef = useRef(null);
  const { email, isPinSet } = useSession();
  const [verify, setVerify] = useState(toVerify);
  const [toSetPin, setToSetPin] = useState(!toVerify);
  const [forgot, setForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [prevPin, setPrevPin] = useState(new Array(6).fill(""));
  const [showMsg, setShowMsg] = useState({
    flag: false,
    msg: "",
  });

  useEffect(() => {
  }, []);

  const handleChange = (element, index) => {
    setShowMsg({ ...showMsg, flag: false, msg: "" });
    if (!/^\d$/.test(element.value) && element.value !== "") return;

    const newPin = [...pin];
    newPin[index] = element.value;
    setPin(newPin);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }

    if (index === 5 && element.value) {
      handleSubmit(newPin);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      e.target.previousSibling?.focus();
    }
  };

  const handleSubmit = (pinArray) => {
    if(forgot) {
      handleVerifyOtp(pinArray.join(''));
      return;
    }
    if(verify) {
      handleVerifyPin(pinArray.join(''));
      return;
    } else if(!verify && toSetPin) {
      setPrevPin(pinArray);
      setToSetPin(false);
      focusRef.current.focus();
      setPin(new Array(6).fill(""));
    } else if(!verify && !toSetPin) {
      if (prevPin.join('') === pinArray.join('')) {
        setShowMsg({...showMsg, flag: false, msg: ""});
        handleSetPin(parseInt(pinArray.join('')));
      } else {
        setShowMsg({flag: true, msg: "Pin does not match, try again"});
        focusRef.current.focus();
        setPin(new Array(6).fill(""));
        setToSetPin(true);
        setPrevPin(new Array(6).fill(""));
      }
    }
  }

  const sendEmail = async (email) => {
    if (!email) {
      return;
    }
    try {
      setLoading(true);
      await fetch(`${process.env.REACT_APP_BASE_URL}/mail/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          email: email,
          cc: [],
          subject: 'Reset security pin',
          text: '',
        }),
      });
      setShowMsg({ ...showMsg, flag: true, msg: "Otp sent to you email" });
      focusRef.current.focus();
    } catch (err) {
      console.error(err);
      showAlert('Failed to send OTP', 'danger', 10020);
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async (code) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/mail/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: encryptMessage(email),
          code: encryptMessage(code.toString()),
        }),
      });
      const res = await response.json();
      if(res.error) {
        showAlert(res.error, 'info', 10324);
        return;
      } 
      if(res.success && res.verified) {
        setForgot(false);
        setShowMsg({ ...showMsg, flag: false, msg: "" });
        setPin(new Array(6).fill(""));
        setPrevPin(new Array(6).fill(""));
        setToSetPin(true);
        setVerify(false);
      } else if(res.status == 0) {
        sendEmail(email);
        setShowMsg({ ...showMsg, flag: true, msg: res.msg + ", New otp is sent to your mail" });
        setPin(new Array(6).fill(""));
        setPrevPin(new Array(6).fill(""));
      } else if(!res.verified){
        setShowMsg({ ...showMsg, flag: true, msg: res.msg });
        setPin(new Array(6).fill(""));
        setPrevPin(new Array(6).fill(""));
      }
      focusRef.current.focus();
    } catch (err) {
      console.error(err);
      showAlert('Error in otp Verification', 'danger', 10021);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (code) => {
    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/pin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ pin: encryptMessage(code.toString()) })
      });
      let data = await response.json();
      if(data.error) {
        showAlert(data.error, 'info', 10324);
        return;
      }
      if (data && data.status === 1) {
        dispatch(setPinVerified(true));
        setForgot(false);
        setShowMsg({ ...showMsg, flag: false, msg: "" });
        setPin(new Array(6).fill(""));
        setPrevPin(new Array(6).fill(""));
      } else if(data.status === 0) {
        setShowMsg({ ...showMsg, flag: true, msg: data.msg });
        setPin(new Array(6).fill(""));
        setPrevPin(new Array(6).fill(""));
      }
      focusRef.current.focus();
    } catch (err) {
      console.log('Error***', err);
      showAlert("Internal server Error", 'danger', 10102);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPin = async (code) => {
    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/pin/set`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ pin: encryptMessage(code.toString()) })
      });
      let data = await response.json();
      if(data.error) {
        showAlert(data.error, 'info', 10324);
        return;
      }
      if (data && data.status === 1) {
        dispatch(setPinVerified(true));
        setShowMsg({ ...showMsg, flag: false, msg: "" });
        setPin(new Array(6).fill(""));
        setPrevPin(new Array(6).fill(""));
        setToSetPin(false);
        showAlert(data.msg, 'success', 10022);
      }
    } catch (err) {
      console.log('Error***', err);
      showAlert("Internal server Error", 'danger', 10102);
    } finally {
      setLoading(false);
    }
  }

  const loadingScreen = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(252, 252, 252, 0.7)',
    borderRadius: '5px',
    zIndex: 99,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  return (
    <div
      className='mt-3'
      style={{
        position: 'absolute',
        top: '100px',
        left: 0,
        width: '100%',
        height: 'auto',
        backgroundColor: 'rgb(220, 220, 220)',
        display: 'flex',
        padding: '20px',
        borderRadius: '10px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >

      {
        loading &&
        <div className='m-0 p-0' style={loadingScreen}>
          <img src={loadingGif} alt="loading" />
        </div>
      }
      <label className="form-label" style={{ fontSize: '18px', marginBottom: '15px' }}>
        <h4 className='m-0 p-0'>
          { forgot ?
            'Enter the Otp to reset pin' :
            (!verify && toSetPin) ? 
              'Please set the Security pin to secured your data!!' : 
              (!verify && !toSetPin) ?
                'Confirm your Security pin' :
                'Enter the Security pin'}</h4>
      </label>

      <div style={{ display: 'flex', gap: '10px' }}>
        {pin.map((value, index) => (
          <input
            key={index}
            type="password"
            maxLength="1"
            value={value}
            ref={index === 0 ? focusRef : null}
            autoFocus={index === 0}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              width: '45px',
              height: '45px',
              textAlign: 'center',
              fontSize: '20px',
              borderRadius: '6px',
              border: '1px solid #999',
              outline: 'none',
            }}
          />
        ))}
      </div>
      <div>
        {showMsg && showMsg.flag && <h6 className='my-1 p-0 text-center text-danger'>{showMsg.msg}</h6>}
      </div>
      { isPinSet && verify && !forgot && !toSetPin &&
        <div style={{ width: '100%', textAlign: 'right'}}>
          <p style={{ margin: 0, cursor: 'pointer', color: '#007bff' }} onClick={() =>{ sendEmail(email); setForgot(true)}}>Forgot password?</p>
        </div>
      }
    </div>
  );
}

export default Security;