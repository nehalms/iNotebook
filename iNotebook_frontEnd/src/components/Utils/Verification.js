import { React, useState }  from 'react'
import otpLoading from './otpLoading.gif'

function Verification(props) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  
  const handleChange = (element, index)=> {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      event.target.previousSibling.focus();
    }
  }

  const handleVerify = () => {
    let code = '';
    code = otp.reduce((code, num) => {
      return code + num;
    });
    props.verify(parseInt(code));
  }

  return (
    <div>
      <label htmlFor="exampleInputEmail1" className="form-label">{props.msg ? props.msg : 'Enter the verification code'}</label> <br />
      <div style={{ display: 'flex', gap: '10px' }}>
        {otp.map((value, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              width: '40px',
              height: '40px',
              textAlign: 'center',
              fontSize: '20px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
        ))}
      </div>
      { props.showGif && 
        <img src={otpLoading} alt="Loading..." style={{width: '126px', height: '40px', marginLeft: '80px'}}/>
      }
      <div className="d-flex my-3">
        <button type="button" onClick={props.sendEmail} className="btn btn-warning mx-2 ms-0">Resend <i className="fa-solid fa-paper-plane mx-2"></i></button>
        <button type="button" onClick={handleVerify} className="btn btn-success mx-2">Verify <i className="fa-solid fa-certificate mx-2"></i></button>
      </div>
    </div>
  )
}

export default Verification
