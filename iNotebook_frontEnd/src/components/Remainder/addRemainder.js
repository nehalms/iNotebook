import React, {useRef, useState } from 'react'
import { encryptMessage } from '../Utils/Encryption';
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';

export default function AddRemainder(props) {

    const [remData, setData] = useState({
        title: '',
        content: '',
        date: ''
    });

    const modalStyle = {
        background: '#eef2f3',
        borderRadius: '15px',
    };
    
    const modalHeaderStyle = {
        backgroundColor: '#ffccbc',
        color: '#bf360c',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
    };
    
    const formLabelStyle = {
        fontSize: '1rem',
        color: '#3e2723',
    };
    
    const formControlStyle = {
        borderRadius: '10px',
        border: '1px solid #bdbdbd',
        padding: '12px',
        fontSize: '1rem',
    };
    
    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#cce7ff',
        color: '#004a99',
        borderRadius: '30px',
    };
    
    const modalButtonPrimaryStyle = {
        backgroundColor: '#007acc',
        color: 'white',
    };
    
    const modalButtonPrimaryDisabledStyle = {
        backgroundColor: '#b3d9ff',
        color: '#6b93ad',
    };

    const refClose = useRef(null);

    const handleClick = async (e) => {
        e.preventDefault();
        if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10110);
            history.navigate("/login");
            return;
        }
        refClose.current.click();
        console.log(remData);
        try {
            props.setLoader({ showLoader: true, msg: "Adding Remainders..."});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/remainder/`, {
                method: "POST", 
                headers: {
                    "auth-token": localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: encryptMessage(remData.title),
                    content: encryptMessage(remData.content),
                    date: encryptMessage(remData.date)
                })
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10128);
                return;
            }
            if(json.status == 1) {
                props.showAlert(json.msg, 'success', 10024);
                props.getRemainders();
            }
        } catch(err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10130);
        } finally {
            props.setLoader({ showLoader: false });
            setData({
                title: '',
                content: '',
                date: ''
            })
        }
    }

    const onChange = (e) => {
        setData({ ...remData, [e.target.name]: e.target.value });
    }


  return (
    <>
        <button
            className="bg-warning p-3 text-black border rounded-pill"
            type="button"
            style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1 }}
            data-bs-toggle="modal"
            data-bs-target="#RemainderModal"
        >
            <i className="fa-solid fa-plus me-2"></i> Add Remainder
        </button>

        <div className="modal fade" id="RemainderModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content" style={modalStyle}>
                    <div className="modal-header" style={modalHeaderStyle}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add Remainder</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label" style={formLabelStyle}>Title</label>
                                <input
                                    type="text"
                                    value={remData.title}
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    onChange={onChange}
                                    style={formControlStyle}
                                    placeholder='At least 5 characters'
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label" style={formLabelStyle}>Description</label>
                                <input
                                    type="text"
                                    value={remData.content}
                                    className="form-control"
                                    id="content"
                                    name="content"
                                    onChange={onChange}
                                    style={formControlStyle}
                                    placeholder='At least 5 characters'
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="description" className="form-label" style={formLabelStyle}>Date n Time</label>
                                <input
                                    type="datetime-local"
                                    value={remData.date}
                                    className="form-control"
                                    id="date"
                                    name="date"
                                    onChange={onChange}
                                    style={formControlStyle}
                                    required
                                />
                            </div>
                            <div className="modal-footer" style={modalFooterStyle}>
                                <button type="button" className="btn btn-secondary" ref={refClose} data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                                <button type="submit" disabled={remData.title.length < 5 || remData.content.length < 5 || remData.date === ''} onClick={handleClick} className="btn btn-primary" style={remData.title.length < 5 || remData.content.length < 5 || remData.date === '' ? modalButtonPrimaryDisabledStyle : modalButtonPrimaryStyle}>Create Remainder</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}
