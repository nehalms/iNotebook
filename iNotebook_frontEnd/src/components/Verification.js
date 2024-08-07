import { React, useState }  from 'react'

function Verification(props) {
  const[code, setCode] = useState({code : 0});

  const onChange = (e)=> {
    console.log(localStorage.getItem('token'));
    setCode({...code, [e.target.name]: e.target.value}) //helps to keep data in note as same and append the new values being typed
  }

  return (
    <div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">{props.msg ? props.msg : 'Enter the verification code'}</label>
          <input type="text" onChange={onChange} className="form-control" id="code" name="code"/>
          <div id="emailHelp" className="form-text">Code will be sent to {props.msg ? 'admin' : 'your'} email</div>
        </div>
        <div className="buttons d-flex my-3">
          <button type="button" onClick={props.sendEmail} className="btn btn-warning mx-2">Resend</button>
          <button type="button" onClick={() => {props.verify(code.code)}} className="btn btn-success mx-2">Verify</button>
        </div>
    </div>
  )
}

export default Verification
