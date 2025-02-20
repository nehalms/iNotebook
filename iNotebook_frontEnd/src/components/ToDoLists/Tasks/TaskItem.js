import React, { useState } from 'react'
import { Tooltip } from "react-tooltip";
import { jwtDecode } from 'jwt-decode';
import { history } from '../../History';
import Popup from '../../Utils/Popup';

function TaskItem(props) {

    const { task, editTask, deleteTask, updateStatus, showInfo } = props
    const [showPopup, setShowPopup] = useState(false);

    const onConfirm = async () => {
        setShowPopup(false);
        if(jwtDecode(localStorage.getItem('token')).exp < Date.now() / 1000) {
            props.showAlert("Session expired Login again", 'danger', 10107);
            history.navigate("/login");
            return;
        }
        await deleteTask(task._id);
        return;
    }

    const onCancel = () => {
        setShowPopup(false);
        return;
    }

  return (
    <div className='col-lg-6' id={task._id}>
        <div className="card shadow-lg my-3">
            <div className="card-body p-1" style={{backgroundColor: task.completed && '#baf5ce'}}>
                <div className="d-flex align-items-center justify-content-between my-1 mx-2 p-2">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value="" id={`flexCheck${task._id}`} style={{border: '1px solid black', height: '30px', width: '30px'}} checked={task.completed} onChange={(e) => {updateStatus(e, task)}}/>
                        <Tooltip anchorId={`flexCheck${task._id}`} content={`Mark as ${task.completed ? 'incomplete': 'complete'}`} place="top" />
                    </div>
                    <h4 className={`m-0 ${task.completed && 'text-decoration-line-through'}`} >{task.taskDesc}</h4>
                    <div>
                        { showPopup && 
                            <div>
                                <Popup onCancel={onCancel} onConfirm={onConfirm}/>
                            </div>
                        }
                        { !showPopup && 
                            <div>
                                {
                                    task.completed ? <i className="fa-solid fa-lg fa-trash mx-2" style={{color: '#fb2d2d'}} onClick={() => {setShowPopup(true)}}></i> :
                                    <i className="fa-regular fa-lg fa-pen-to-square mx-2 text-secondary" onClick={() => {editTask(task)}}></i>
                                }
                                <i className="fa-solid fa-lg fa-circle-info mx-2" style={{color: task.completed ? 'black': '#FFD43B'}} onClick={() => {showInfo(true, task)}}></i>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TaskItem
