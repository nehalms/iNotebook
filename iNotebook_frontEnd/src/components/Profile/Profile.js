import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { encryptMessage } from '../Utils/Encryption';
import { history } from '../History';
import AuthContext from '../../context/auth_state/authContext';

export default function Profile(props) {
  const { getUserState, handleSessionExpiry } = useContext(AuthContext);
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
    const fetchData = async () => {
      let state = await getUserState();
      if (!state.loggedIn) {
        history.navigate("/login");
        return;
      } else {
        getUserProfile();
      }
    };
    fetchData();
    
  }, []);

  const getUserProfile = async () => {
    try {
      props.setLoader({ showLoader: true, msg: "Please wait" });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      handleSessionExpiry(json);
      setProfile({ id: json._id, name: json.name, email: json.email, createdOn: json.date, lastLogIn: json.lastLogIn, isActive: json.isActive });
      setUpdtProfile({ name: json.name });
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger', 10112);
    }
  };

  const onChange = (event) => {
    setUpdtProfile({ ...updatedProfile, [event.target.name]: event.target.value });
  };

  const onChangePassword = (event) => {
    setPass({ ...pass, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      props.setLoader({ showLoader: true, msg: "Updating Name" });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/updateName`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ name: encryptMessage(updatedProfile.name) })
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if (json.success === true) {
        setProfile({ ...profile, name: json.user.name });
        props.showAlert("Name updated successfully", 'success', 10113);
      } else {
        handleSessionExpiry(json);
        props.showAlert("Something went wrong", 'danger', 10114);
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger', 10115);
    }
  };

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();
      if (pass.password !== pass.cpassword) {
        props.showAlert("Password does not match", 'warning', 10116);
        return;
      }
      props.setLoader({ showLoader: true, msg: "Updating password" });
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/updatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id: encryptMessage(profile.id), 
          email: encryptMessage(profile.email), 
          password: encryptMessage(pass.password) 
        }),
      });
      props.setLoader({ showLoader: false });
      const json = await response.json();
      if (json.success) {
        props.showAlert("Password updated successfully", 'success', 10117);
        setPass({ password: '', cpassword: '' });
      } else {
        handleSessionExpiry(json);
        props.showAlert("Something went wrong", 'danger', 10118);
      }
    } catch (err) {
      props.setLoader({ showLoader: false });
      console.log("Error**", err);
      props.showAlert("Some error Occured", 'danger', 10119);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', margin: '20px 0' }}>
          <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 className='text-black' style={{ margin: '0', padding: '10px', backgroundColor: '#dff0d8', borderRadius: '10px', fontWeight: '600', fontSize: '1.5rem' }}>Profile</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label className='text-black' style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Name</label>
                  <input type="text" style={{ width: '100%', borderRadius: '8px', padding: '10px', border: '1px solid #ccc' }} onChange={onChange} value={updatedProfile.name} name="name" required />
                </div>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label className='text-black' style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Email</label>
                  <input type="email" style={{ width: '100%', borderRadius: '8px', padding: '10px', border: '1px solid #ccc' }} value={profile.email} disabled />
                </div>
                <div style={{ flex: '1', minWidth: '250px' }}>
                  <label className='text-black' style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Account Created On</label>
                  <input type="text" style={{ width: '100%', borderRadius: '8px', padding: '10px', border: '1px solid #ccc' }} value={moment(profile.createdOn).format('LLL')} disabled />
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#ffc107', border: 'none', fontWeight: '600', cursor: 'pointer', width: '50%' }} disabled={profile.name.trim() === updatedProfile.name.trim() || updatedProfile.name.trim().length < 5}>Update Profile <i className="fa-solid fa-pen-to-square mx-2"></i></button>
              </div>
            </form>
            <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '10px' }}>
              <h5 style={{ marginBottom: '20px', fontWeight: '600' }}>Update Password</h5>
              <form onSubmit={handleUpdate}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ flex: '1', minWidth: '250px' }}>
                    <label className='text-black' style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>New Password</label>
                    <input type={showPassword ? 'text' : 'password'} style={{ width: '100%', borderRadius: '8px', padding: '10px', border: '1px solid #ccc' }} onChange={onChangePassword} value={pass.password} name="password" required minLength={6} />
                  </div>
                  <div style={{ flex: '1', minWidth: '250px' }}>
                    <label className='text-black' style={{ display: 'block', fontWeight: '500', marginBottom: '5px' }}>Re-enter Password</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type={showPassword ? 'text' : 'password'} style={{ flex: '1', borderRadius: '8px', padding: '10px', border: `${pass.password !== pass.cpassword && pass.cpassword !== "" ? '2px solid red' : pass.cpassword !== "" ? '2px solid green' : '1px solid #ccc'}` }} onChange={onChangePassword} value={pass.cpassword} name="cpassword" required minLength={6} />
                      <i style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)} className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button type="submit" style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#dc3545', border: 'none', fontWeight: '600', cursor: 'pointer', width: '50%' }}>Update Password <i className="fa-solid fa-pen-to-square mx-2"></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
