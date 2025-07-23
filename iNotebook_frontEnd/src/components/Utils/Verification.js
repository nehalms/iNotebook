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
    if (index === 5 && element.value) {
      handleVerify(newOtp);
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      event.target.previousSibling.focus();
    }
  }

  const handleVerify = (otp) => {
    let code = '';
    code = otp.reduce((code, num) => {
      return code + num;
    });
    props.verify(parseInt(code));
  }

  return (
    <div className='mt-3'>
      <label htmlFor="exampleInputEmail1" className="form-label">{props.msg ? props.msg : 'Enter the verification code'}</label> <br />
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div className="align-items-center justify-content-center ms-2" style={{ display: 'flex', gap: '10px' }}>
          {otp.map((value, index) => (
            <input
            key={index}
              type="password"
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
        { props.showGif ?
          <img className='m-2' src={otpLoading} alt="Loading..." style={{width: '126px', height: '40px', marginLeft: '80px'}}/> :
          <button type="button" onClick={props.sendEmail} className="btn btn-warning m-2">Resend <i className="fa-solid fa-paper-plane mx-2"></i></button>
        }
        {/* <button type="button" onClick={handleVerify} className="btn btn-success mx-2">Verify <i className="fa-solid fa-certificate mx-2"></i></button> */}
      </div>
    </div>
  )
}

export default Verification
