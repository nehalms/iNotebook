import React, { useEffect, useState } from 'react'

export default function Encrypt_Decrypt_Msg(props) {

  const [encrypt, setEncrypt] = useState({
    secretMsg: "",
    coverMsg: "",
    password: "",
  });
  const [encryptedMsg, setEnMsg] = useState("");

  const [decrypt, setDecrypt] = useState({
    msg: "",
    password: "",
  });
  const [decryptedMsg, setDeMsg] = useState("");

  useEffect(() => {

  }, [encryptedMsg, decryptedMsg]);

  const onEncryptChange = (event) => {
    setEncrypt({...encrypt, [event.target.name]: event.target.value});
  }

  const onDecryptChange = (event) => {
    setDecrypt({...decrypt, [event.target.name]: event.target.value});
  }

  const handleEncrypt = async (e) => {
    e.preventDefault();
    if(encrypt.password.length < 4) {
      props.showAlert("Password should be atleast 4 characters", 'info');
      return;
    }
    try {
      props.setLoader({ showLoader: true, msg: "Encrypting message"});
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/msg/encrypt`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          coverMsg: encrypt.coverMsg,
          secretMsg: encrypt.secretMsg,
          password: encrypt.password,
        })
      });
      let data = await response.json();
      if(data) {
        if(data.success == true) {
          setEnMsg(data.msg);
        } else {
          props.showAlert(data.msg, 'warning');
        }
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("Internal server Error", 'danger');
    } finally {
      props.setLoader({ showLoader: false});
    }
  }

  const handleDecrypt = async (e) => {
    e.preventDefault();
    try {
      props.setLoader({ showLoader: true, msg: "Decrypting message"});
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/msg/decrypt`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          msg: decrypt.msg,
          password: decrypt.password,
        })
      });
      let data = await response.json();
      if(data) {
        if(data.success == true) {
          setDeMsg(data.msg);
        } else {
          if(data.msg === 'Invisible stream not detected! Please copy and paste the StegCloak text sent by the sender.');
            data.msg = "No hidden message found";
          props.showAlert(data.msg, 'warning');
        }
      }
    } catch (err) {
      console.log('Error***', err);
      props.showAlert("No Hidden message found", 'danger');
    } finally {
      props.setLoader({ showLoader: false});
    }
  }

  return (
    <div className='row my-2'>
      <div className='col-lg-12'>
        <div className="card shadow-lg my-3">
          <div className="card-body">
            <h3 className='text-center'>Encrypt / Decrypt your messages by hiding using cover messages</h3>
          </div>
        </div>
      </div>
      <div className='col-lg'>
        <div className="card shadow-lg my-3">
          <div className="card-body">
            <form onSubmit={handleEncrypt}>
              <h2 className='mb-3 p-3 text-center border rounded bg-success-subtle'>Encrypt</h2>
              <div className="mb-3">
                  <label htmlFor="coverMsg" className="form-label">Cover Message</label>
                  <input type="text" className="form-control" onChange={onEncryptChange} value={encrypt.coverMsg} id="coverMsg" name="coverMsg" placeholder='Message that hides the secret message' required/>
              </div>
              <div className="mb-3">
                  <label htmlFor="coverMsg" className="form-label">Secret Message</label>
                  <input type="text" className="form-control" onChange={onEncryptChange} value={encrypt.secretMsg} id="secretMsg" name="secretMsg" placeholder='Message to send' required/>
              </div>
              <div className="mb-2">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" onChange={onEncryptChange} value={encrypt.password} id="password" name="password" placeholder='password that encrypts the message' required/>
              </div>
              <button type="submit" className="btn btn-primary mt-3 mb-4" style={{width: '100%'}}>Encrypt <i className="fa-solid fa-file-shield mx-2"></i></button>
              { 
                encryptedMsg && encryptedMsg !== "" &&
                <>
                  <p className='text-danger p-1 m-0'>* Click on the text to copy</p>
                  <div className='mb-2 rounded border p-3 text-center bg-secondary-subtle' style={{WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none', userSelect: 'none', cursor: 'pointer'}} onClick={() => {navigator.clipboard.writeText(encryptedMsg); props.showAlert("Text copied", 'success'); }}>
                    <h4 className='m-0'>{encryptedMsg}</h4>
                  </div>
                </>
              }
            </form>
          </div>
        </div>
      </div>
      <div className='col-lg'>
        <div className="card shadow-lg my-3">
          <div className="card-body">
            <form onSubmit={handleDecrypt}>
              <h2 className='mb-3 p-3 text-center border rounded bg-danger-subtle'>Decrypt</h2>
              <div className="mb-3">
                  <label htmlFor="msg" className="form-label">Enter Message</label>
                  <input type="text" className="form-control" onChange={onDecryptChange} value={decrypt.secretMsg} id="msg" name="msg" placeholder='Message to decrypt' required/>
              </div>
              <div className="mb-2">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" onChange={onDecryptChange} value={decrypt.secretMsg} id="password1" name="password" placeholder='password that encrypts the message' required/>
              </div>
              <button type="submit" className="btn btn-warning mt-3 mb-4" style={{width: '100%'}}>Decrypt <i className="fa-solid fa-file-shield mx-2"></i></button>
              { 
                decryptedMsg && decryptedMsg !== "" &&
                <div className='mb-2 rounded border p-3 text-center bg-secondary-subtle'>
                  <h4>{decryptedMsg}</h4>
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
