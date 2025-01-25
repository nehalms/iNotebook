import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment';
import AddRemainder from './addRemainder';
import { jwtDecode } from 'jwt-decode';
import { history } from '../History';
import RemainderItem from './remainderItem';

const Remainder = (props) => {

    const ref = useRef();
    const [remds, setRemds] = useState([]);
    const [remainder, setRemainder] = useState({
        title: '',  
        content: '',
        remainderDate: '',
        isComp: false,
        date: ''
    });
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
                props.showAlert("Session expired Login again", 'danger', 10109);
                history.navigate("/login");
            } else {
                getRemainders();
            }
        }
        else {
            history.navigate("/login");
        }
    }, []);

    const getRemainders = async () => {
        try {
            props.setLoader({ showLoader: true, msg: "Fetching Remainders..."});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/remainder/`, {
              method: "GET", 
              headers: {
                  "auth-token": localStorage.getItem('token'),
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10128);
                return;
            }
            if(json.status == 1) {
                setRemds(json.data);
                // props.showAlert('Remainders fetched successfully', 'success', 10024);
            }
            return;
        } catch(err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10130);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const deleteRemd = async (id) => {
        try {
            props.setLoader({ showLoader: true, msg: "Deleting Remainder..."});
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/remainder/${id}`, {
              method: "DELETE", 
              headers: {
                  "auth-token": localStorage.getItem('token'),
                },
            });
            const json = await response.json();
            if(json.error) {
                props.showAlert(json.error, 'danger', 10128);
                return;
            }
            if(json.status == 1) {
                getRemainders();
            }
            props.showAlert(json.msg, 'success', 10024);
        } catch(err) {
            console.log("Error**", err);
            props.showAlert("Some error Occured", 'danger', 10130);
        } finally {
            props.setLoader({ showLoader: false });
        }
    }

    const modalStyle = {
        background: '#f0f4f8',
        borderRadius: '15px',
    };
    
    const modalHeaderStyle = {
        backgroundColor: '#ffeb3b',
        color: '#795548',
        borderTopLeftRadius: '15px',
        borderTopRightRadius: '15px',
    };
    
    const modalFooterStyle = {
        justifyContent: 'space-between',
        padding: '15px 25px',
    };
    
    const modalButtonSecondaryStyle = {
        backgroundColor: '#ffcc80',
        color: '#5d4037',
        borderRadius: '30px',
    };

    const showInfo = (remainder) => {
        setRemainder({
            title: remainder.title,
            content: remainder.content,
            remainderDate: remainder.remainderDate,
            isComp: remainder.isComp,
            date: remainder.date
        });
        ref.current.click();
    }

    return (
        <>
            <button type="button" className="btn" ref={ref} hidden={true} data-bs-toggle="modal" data-bs-target="#InfoModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="InfoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content" style={modalStyle}>
                        <div className="modal-header" style={modalHeaderStyle}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Remainder</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <p name="title" className='mx-1'><strong>Title: </strong>{remainder.title}</p>
                            </div>
                            <div className="mb-3">
                                <p name="content" className='mx-1'><strong>Content: </strong>{remainder.content}</p>
                            </div>
                            <div className='mb-3'>
                                <p name="date" className='mx-1'><strong>Remainder Date: </strong>{moment(new Date(remainder.remainderDate)).format('LLL')}</p>
                            </div>
                            <div className='mb-3'>
                                <p name="status" className='mx-1'><strong>Status: </strong><span>{remainder.isComp == true ? 
                                        ( <div className="badge bg-success text-white">Completed</div> ) :
                                        ( <div className="badge bg-warning text-black">Pending</div> )
                                    }</span></p>
                            </div>
                            <div className='mb-3'>
                                <p name="dateCreated" className='mx-1'><strong>Created Date: </strong>{moment(new Date(remainder.date)).format('LLL')}</p>
                            </div>
                            <div className="modal-footer d-flex align-items-center justify-content-center" style={modalFooterStyle}>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={modalButtonSecondaryStyle}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AddRemainder setLoader={props.setLoader} showAlert={props.showAlert} getRemainders={getRemainders}/>
            <div className="row my-5">
                <div className="d-flex align-items-center justify-content-start">
                    <h2 className=''>Your Remainders</h2>
                </div>
                <div className='container mx-2'>
                    {remds.length === 0 && "You can set your remainders and you will be remainded through your registered mail"}
                </div>
                {remds.length > 0 && remds.map((remd) => {
                    return (
                        <RemainderItem showAlert={props.showAlert} key={remd._id} remainder={remd} deleteRemd={deleteRemd} showInfo={showInfo} />
                    );
                })}
            </div>
        </>
    );
}

export default Remainder;

