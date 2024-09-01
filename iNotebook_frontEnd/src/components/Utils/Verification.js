import { React, useState }  from 'react'
import './Verification.css'

function Verification(props) {
  const[code, setCode] = useState({code : 0});
  
  const onChange = (e)=> {
    // setCode({[e.target.name]: code.code + e.target.value}) //helps to keep data in note as same and append the new values being typed
    let num = 6;
    let tmpCode = '';
    for(var i=1; i<=num; i++) {
      tmpCode += document.getElementById(i).value;
    }
    setCode({code: Number(tmpCode)})
  }

  const moveFocus = (event) => {
    if(!event) {return;}
    let id = Number(event.target.id);
    event.target.value = event.code.startsWith('Digit') 
      ? id !== 6 
        ? event.key : event.target.value
        : "";
    if(event.key !== 'Backspace') {
      if(id < 6)
        document.getElementById(id+1).focus();
    }
     else if(event.key === 'Backspace') {
      if(id > 1){
        document.getElementById(id-1).focus();
        return;
      } 
    }
  }

  return (
    <div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">{props.msg ? props.msg : 'Enter the verification code'}</label> <br />
            <div className="otp-container" onChange={onChange}>
              <input type="text" id='1' style={{width: window.innerHeight < 700 ? '40px' : '30px', height: window.innerHeight < 700 ? '40px' : '30px'}} className="otp-box" maxLength="1" autoComplete='off' onKeyUp={moveFocus} />
              <input type="text" id='2' style={{width: window.innerHeight < 700 ? '40px' : '30px', height: window.innerHeight < 700 ? '40px' : '30px'}} className="otp-box" maxLength="1" autoComplete='off' onKeyUp={moveFocus} />
              <input type="text" id='3' style={{width: window.innerHeight < 700 ? '40px' : '30px', height: window.innerHeight < 700 ? '40px' : '30px'}} className="otp-box" maxLength="1" autoComplete='off' onKeyUp={moveFocus} />
              <input type="text" id='4' style={{width: window.innerHeight < 700 ? '40px' : '30px', height: window.innerHeight < 700 ? '40px' : '30px'}} className="otp-box" maxLength="1" autoComplete='off' onKeyUp={moveFocus} />
              <input type="text" id='5' style={{width: window.innerHeight < 700 ? '40px' : '30px', height: window.innerHeight < 700 ? '40px' : '30px'}} className="otp-box" maxLength="1" autoComplete='off' onKeyUp={moveFocus} />
              <input type="text" id='6' style={{width: window.innerHeight < 700 ? '40px' : '30px', height: window.innerHeight < 700 ? '40px' : '30px'}} className="otp-box" maxLength="1" autoComplete='off' onKeyUp={moveFocus} />
            </div>
          <div id="emailHelp" className="form-text bg-danger p-1 text-center border rounded text-white">***Please check in spam folder too</div>
        </div>
        <div className="buttons d-flex my-3">
          <button type="button" onClick={props.sendEmail} className="btn btn-warning mx-2">Resend <i className="fa-solid fa-paper-plane mx-2"></i></button>
          <button type="button" onClick={() => {props.verify(code.code)}} className="btn btn-success mx-2">Verify <i className="fa-solid fa-certificate mx-2"></i></button>
        </div>
    </div>
  )
}

export default Verification
