import moment from 'moment';
import React, { useEffect, useState } from 'react'

export default function Profile(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    email: '',
    createdOn: '',
    lastLogIn: '',
    isActive: '',
  });
  const [updatedProfile, setUpdtProfile] = useState({
    name: '',
  });
  const [pass, setPass] = useState({
    password: '',
    cpassword: '',
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
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
      setProfile({id: json._id, name: json.name, email: json.email, createdOn: json.date, lastLogIn: json.lastLogIn, isActive: json.isActive});
      setUpdtProfile({name: json.name});
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  }

  const onChange = (event) => {
    setUpdtProfile({...updatedProfile, [event.target.name]: event.target.value})
  }

  const onChangePassword = (event) =>{
    setPass({...pass, [event.target.name]: event.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      props.setLoader({ showLoader: true, msg: "Updating Name"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/updateName`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({name: updatedProfile.name})
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if(json.success === true) {
        setProfile({...profile, name: json.user.name});
        props.showAlert("Name updated successfully", 'success');
      } else{
        props.showAlert("Something went wrong", 'danger');
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  }

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      if(pass.password !== pass.cpassword) {
        props.showAlert("Password does not match", 'warning');
        return;
      }
      props.setLoader({ showLoader: true, msg: "Updating password"});
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/updatePassword`, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: profile.id, email: profile.email, password: pass.password}),
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if(json.success){
        props.showAlert("Password updated successfully", 'success');
        setPass({password: '', cpassword: ''});
      }
      else{
        props.showAlert("Something went wrong", 'danger');
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger');
    }
  }

  return (
    <div className='row my-2'>
      <div className='col-lg'>
        <div className="card shadow-lg my-3">
          <div className="card-body">
            <div className='d-flex align-items-center justify-content-center'>
              <h2 className='text-center m-0 p-3 bg-success-subtle border rounded' style={{width: '95%'}}>Profile</h2>
            </div>
            <form className='m-2 p-1' onSubmit={handleSubmit}>
              <div className="d-flex align-item-center justify-content-evenly flex-wrap">
                <div className="my-2" style={{width: '30%', minWidth: '250px'}}>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onChange} value={updatedProfile.name} id="name" name="name" required/>
                </div>
                <div className="my-2" style={{width: '30%', minWidth: '250px'}}>
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" onChange={onChange} value={profile.email} id="email" name="email" disabled/>
                </div>
                <div className="my-2" style={{width: '30%', minWidth: '250px'}}>
                    <label htmlFor="createdOn" className="form-label">Account Created On</label>
                    <input type="text" className="form-control" onChange={onChange} value={moment(profile.createdOn).format('LLL')} id="createdOn" name="createdOn" disabled/>
                </div>              
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-warning mt-3 mb-4" disabled={profile.name.trim() === updatedProfile.name.trim() || updatedProfile.name === '' || updatedProfile.name.trim().length < 5} style={{width: '50%'}}>Update Profile<i class="fa-solid fa-pen-to-square mx-2"></i></button>
              </div>
            </form>
            <div className="m-2 p-2 border rounded">
              <h5 className='text-left m-0 p-2' style={{width: '95%'}}>Update Password</h5>
              <form onSubmit={handleUpdate}> 
                <div className='d-flex align-item-center justify-content-start flex-wrap'>
                  <div className="my-3 mx-1" style={{width: '40%', minWidth: '250px'}}>
                    <label htmlFor="password" className="form-label">New Password</label>
                    <input type={showPassword ? 'text' : 'password'} className="form-control" onChange={onChangePassword} value={pass.password} id="password" name="password" placeholder='Enter password' minLength={6} required/>
                  </div>
                  <div className="my-3 mx-1" style={{width: '40%', minWidth: '250px'}}>
                    <label htmlFor="cpassword" className="form-label">Re-enter password</label>
                    <div className='d-flex align-item-center justify-content-start'>
                      <input type={showPassword ? 'text' : 'password'} className="form-control" onChange={onChangePassword} value={pass.cpassword} id="cpassword" name="cpassword" placeholder='Re-enter password' minLength={6} required style={{border: `${pass.password !== pass.cpassword && pass.cpassword !== "" ? '2px solid red' : pass.cpassword !== "" ? '2px solid green' : ''}`}}/>
                      <i onClick={(e) => {e.preventDefault(); setShowPassword(!showPassword);}} className={showPassword ? "fa-solid p-2 py-2 mx-2 border rounded fa-eye d-flex align-items-center" : "fa-solid p-2 mx-2 border rounded fa-eye-slash d-flex align-items-center"}></i>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <button type='submit' className="btn btn-danger mt-3 mb-4" style={{width: '50%'}}>Update Password<i class="fa-solid fa-pen-to-square mx-2"></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
