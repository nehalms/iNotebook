import React, { useState } from 'react'
import { Tooltip } from "react-tooltip";
import {jwtDecode} from 'jwt-decode';
import Popup from '../Utils/Popup';
import { history } from '../History';
import moment from 'moment';

const RemainderItem = (props) => {

    const { remainder, deleteRemd } = props;
    const [showPopup, setShowPopup] = useState(false);

    const onCancel = () => {
        setShowPopup(false);
        return;
    }

    const onConfirm = async () => {
        setShowPopup(false);
        if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10107);
            history.navigate("/login");
            return;
        }
        await deleteRemd(remainder._id); 
        props.showAlert("Note deleted successfully", 'success', 10108);
        return;
    }
    
    return (
        <>
            <div className='col-lg-3' id={remainder._id}>
                <div className={`card shadow-lg my-3 ${remainder.isComp ? 'bg-success-subtle' : ''}`}>
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between my-1">
                            <h5 className="card-title my-0">{remainder.title}</h5>
                            { showPopup && 
                                <div>
                                    <Popup onCancel={onCancel} onConfirm={onConfirm}/>
                                </div>
                            }
                            { !showPopup && 
                                <div>
                                    <i id={`info ${remainder._id}`} className="fa-solid fa-arrow-up-right-from-square mx-2" onClick={() => { props.showInfo(remainder) }}></i>
                                    <Tooltip anchorId={`info ${remainder._id}`} content={`More info`} place="top" />

                                    { remainder.isComp && 
                                    <>
                                        <i id={`delete ${remainder._id}`} className="fa-solid fa-trash mx-2 text-danger" onClick={() => {setShowPopup(true)}}></i>
                                        <Tooltip anchorId={`delete ${remainder._id}`} content={`Delete`} place="top" />
                                    </>}
                                </div>
                            }
                        </div>
                        <p className="card-text text-primary" >{moment(new Date(remainder.date)).format('LLL')}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RemainderItem
